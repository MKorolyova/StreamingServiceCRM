import { and, count, eq, gte, sum } from "drizzle-orm";

import { db } from "@/db";
import { payments, profiles, subscribers, watchSessions } from "@/db/schema";

export type SubscriberTotals = {
  total: number;
  active: number;
  profiles: number;
};

export async function getSubscriberTotals(): Promise<SubscriberTotals> {
  const [total, active, profileCount] = await Promise.all([
    db.$count(subscribers),
    db.$count(subscribers, eq(subscribers.status, "ACTIVE")),
    db.$count(profiles),
  ]);

  return { total, active, profiles: profileCount };
}

/** Number of successful payments made on or after the given moment. */
export async function countPaidPaymentsSince(since: Date): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(payments)
    .where(and(eq(payments.status, "PAID"), gte(payments.createdAt, since)));

  return row?.value ?? 0;
}

/** Minutes watched across all profiles on or after the given moment. */
export async function sumMinutesWatchedSince(since: Date): Promise<number> {
  const [row] = await db
    .select({ value: sum(watchSessions.minutesWatched).mapWith(Number) })
    .from(watchSessions)
    .where(gte(watchSessions.watchedAt, since));

  return row?.value ?? 0;
}
