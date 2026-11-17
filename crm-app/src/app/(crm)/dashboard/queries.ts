import { and, count, desc, eq, gte, isNull, sql, sum } from "drizzle-orm";
import { countries, movies, payments, plans, subscribers, subscriptions, watchSessions } from "@/db/schema";
import { db } from "@/db";

export type SubscriberTotals = {
  total: number;
  active: number;
  paused: number;
  canceled: number;
  newSignups: number;
};

export async function getSubscriberTotals(signupsSince: Date): Promise<SubscriberTotals> {
  const [row] = await db
    .select({
      total: count(),
      active: count(sql`case when ${subscribers.status} = 'ACTIVE' then 1 end`),
      paused: count(sql`case when ${subscribers.status} = 'PAUSED' then 1 end`),
      canceled: count(sql`case when ${subscribers.status} = 'CANCELED' then 1 end`),
      newSignups: count(sql`case when ${subscribers.createdAt} >= ${signupsSince.toISOString()}::timestamptz then 1 end`),
    })
    .from(subscribers);

  return row ?? { total: 0, active: 0, paused: 0, canceled: 0, newSignups: 0 };
}

export type RecurringRevenue = {
  monthlyCents: number;
  subscriptions: number;
};

export async function getMonthlyRecurringRevenue(): Promise<RecurringRevenue> {
  const [row] = await db
    .select({
      monthlyCents: sum(plans.monthlyPriceCents).mapWith(Number),
      subscriptions: count(),
    })
    .from(subscriptions)
    .innerJoin(plans, eq(plans.planId, subscriptions.planId))
    .innerJoin(subscribers, eq(subscribers.subscriberId, subscriptions.subscriberId))
    .where(and(isNull(subscriptions.endDate), eq(subscribers.status, "ACTIVE")));

  return row ?? { monthlyCents: 0, subscriptions: 0 };
}

export type PaymentTotals = {
  paid: number;
  failed: number;
  refunded: number;
};

export async function getPaymentTotalsSince(since: Date): Promise<PaymentTotals> {
  const [row] = await db
    .select({
      paid: count(sql`case when ${payments.status} = 'PAID' then 1 end`),
      failed: count(sql`case when ${payments.status} = 'FAILED' then 1 end`),
      refunded: count(sql`case when ${payments.status} = 'REFUNDED' then 1 end`),
    })
    .from(payments)
    .where(gte(payments.createdAt, since));

  return row ?? { paid: 0, failed: 0, refunded: 0 };
}

export type FailedPaymentEntry = {
  paymentId: string;
  subscriberId: string;
  subscriberName: string;
  amountCents: number;
  currencyCode: string;
  method: string;
  createdAt: Date;
};

export async function listRecentFailedPaymentsOfActiveSubscribers(limit: number): Promise<FailedPaymentEntry[]> {
  return db
    .select({
      paymentId: payments.paymentId,
      subscriberId: subscribers.subscriberId,
      subscriberName: subscribers.name,
      amountCents: payments.amountCents,
      currencyCode: countries.currencyCode,
      method: payments.method,
      createdAt: payments.createdAt,
    })
    .from(payments)
    .innerJoin(subscribers, eq(subscribers.subscriberId, payments.subscriberId))
    .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
    .where(and(eq(payments.status, "FAILED"), eq(subscribers.status, "ACTIVE")))
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function sumMinutesWatchedSince(since: Date): Promise<number> {
  const [row] = await db
    .select({ 
      value: sum(watchSessions.minutesWatched).mapWith(Number) 
    })
    .from(watchSessions)
    .where(gte(watchSessions.watchedAt, since));

  return row?.value ?? 0;
}

export type TopMovieEntry = {
  movieId: string;
  title: string;
  minutesWatched: number;
  sessions: number;
};

export async function listTopMoviesSince(since: Date, limit: number): Promise<TopMovieEntry[]> {
  return db
    .select({ 
      movieId: movies.movieId, 
      title: movies.title, 
      minutesWatched: sum(watchSessions.minutesWatched).mapWith(Number),
      sessions: count() 
    })
    .from(watchSessions)
    .innerJoin(movies, eq(movies.movieId, watchSessions.movieId))
    .where(gte(watchSessions.watchedAt, since))
    .groupBy(movies.movieId, movies.title)
    .orderBy(desc(sum(watchSessions.minutesWatched).mapWith(Number)), movies.title)
    .limit(limit);
}

