import { count, countDistinct, desc, eq, inArray, isNull, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import {
  countries,
  devices,
  payments,
  plans,
  profiles,
  subscribers,
  subscriberStatusEnum,
  subscriptions,
  watchSessions,
} from "@/db/schema";
import type { Payment } from "@/types/payments";
import type { Profile, Subscriber } from "@/types/subscribers";

export type SubscriberListEntry = Subscriber & {
  countryName: string;
  currencyCode: string;
  profiles: Profile[];
  /** Minutes watched across all of the subscriber's profiles. */
  minutesWatched: number;
};

export type SubscriberList = {
  entries: SubscriberListEntry[];
  total: number;
};

/** One page of subscribers, newest first, with their profiles and total watch time. */
export async function listSubscribers(page: number, pageSize: number): Promise<SubscriberList> {
  const [rows, total] = await Promise.all([
    db
      .select({
        subscriber: subscribers,
        countryName: countries.name,
        currencyCode: countries.currencyCode,
      })
      .from(subscribers)
      .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
      .orderBy(desc(subscribers.createdAt), subscribers.subscriberId)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.$count(subscribers),
  ]);

  const subscriberIds = rows.map((row) => row.subscriber.subscriberId);
  if (subscriberIds.length === 0) return { entries: [], total };

  const [profileRows, watchRows] = await Promise.all([
    db
      .select()
      .from(profiles)
      .where(inArray(profiles.subscriberId, subscriberIds))
      .orderBy(desc(profiles.isDefault), profiles.profileName),
    db
      .select({
        subscriberId: watchSessions.subscriberId,
        minutesWatched: sum(watchSessions.minutesWatched).mapWith(Number),
      })
      .from(watchSessions)
      .where(inArray(watchSessions.subscriberId, subscriberIds))
      .groupBy(watchSessions.subscriberId),
  ]);

  const profilesBySubscriber = Map.groupBy(profileRows, (profile) => profile.subscriberId);
  const minutesBySubscriber = new Map(watchRows.map((row) => [row.subscriberId, row.minutesWatched]));

  return {
    total,
    entries: rows.map(({ subscriber, countryName, currencyCode }) => ({
      ...subscriber,
      countryName,
      currencyCode,
      profiles: profilesBySubscriber.get(subscriber.subscriberId) ?? [],
      minutesWatched: minutesBySubscriber.get(subscriber.subscriberId) ?? 0,
    })),
  };
}

/** Every payment of the given subscribers, newest first, grouped by subscriber. */
export async function listPaymentsBySubscriber(subscriberIds: string[]): Promise<Map<string, Payment[]>> {
  if (subscriberIds.length === 0) return new Map();

  const rows = await db
    .select()
    .from(payments)
    .where(inArray(payments.subscriberId, subscriberIds))
    .orderBy(desc(payments.createdAt));

  return Map.groupBy(rows, (payment) => payment.subscriberId);
}

export type BreakdownEntry = {
  label: string;
  subscribers: number;
  profiles: number;
};

export type SubscriberBreakdown = {
  countries: BreakdownEntry[];
  plans: BreakdownEntry[];
  devices: BreakdownEntry[];
  statuses: BreakdownEntry[];
};

/** Subscriber and profile counts split by country, active plan, device type and status. */
export async function getSubscriberBreakdown(): Promise<SubscriberBreakdown> {
  const subscriberCount = countDistinct(subscribers.subscriberId);
  // One joined row per profile, so counting profile names counts profiles.
  const profileCount = count(profiles.profileName);

  const [countryRows, statusRows, planRows, deviceRows] = await Promise.all([
    db
      .select({ label: countries.name, subscribers: subscriberCount, profiles: profileCount })
      .from(subscribers)
      .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
      .leftJoin(profiles, eq(profiles.subscriberId, subscribers.subscriberId))
      .groupBy(countries.name)
      .orderBy(desc(subscriberCount), countries.name),
    db
      .select({ label: subscribers.status, subscribers: subscriberCount, profiles: profileCount })
      .from(subscribers)
      .leftJoin(profiles, eq(profiles.subscriberId, subscribers.subscriberId))
      .groupBy(subscribers.status),
    db
      .select({
        label: plans.name,
        subscribers: countDistinct(subscriptions.subscriberId),
        profiles: profileCount,
      })
      .from(plans)
      // Only the current plan of each subscriber: ended subscriptions are history.
      .leftJoin(subscriptions, sql`${subscriptions.planId} = ${plans.planId} and ${isNull(subscriptions.endDate)}`)
      .leftJoin(profiles, eq(profiles.subscriberId, subscriptions.subscriberId))
      .groupBy(plans.name, plans.monthlyPriceCents)
      .orderBy(plans.monthlyPriceCents),
    db
      .select({
        label: devices.type,
        subscribers: countDistinct(watchSessions.subscriberId),
        profiles: sql<number>`count(distinct (${watchSessions.subscriberId}, ${watchSessions.profileName}))`.mapWith(Number),
      })
      .from(watchSessions)
      .innerJoin(devices, eq(devices.deviceId, watchSessions.deviceId))
      .groupBy(devices.type),
  ]);

  // Show every status, including the ones nobody has right now.
  const statusByLabel = new Map(statusRows.map((row) => [row.label, row]));
  const statuses = subscriberStatusEnum.enumValues.map(
    (status) => statusByLabel.get(status) ?? { label: status, subscribers: 0, profiles: 0 },
  );

  return { countries: countryRows, plans: planRows, devices: deviceRows, statuses };
}
