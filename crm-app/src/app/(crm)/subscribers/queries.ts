import { and, asc, count, countDistinct, desc, eq, gte, ilike, inArray, isNotNull, isNull, lt, sum, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { countries, plans, profiles, subscribers, subscriptions, watchSessions } from "@/db/schema";
import { addDaysToIsoDate } from "@/lib/dates";
import type { ListSubscribersQuery, Profile, SubscriberStatus } from "@/types/subscribers";

const SUBSCRIBER_SORT_COLUMNS: Record<ListSubscribersQuery["sortBy"], PgColumn | SQL> = {
  name: subscribers.name,
  email: subscribers.email,
  created: subscribers.createdAt,
  status: subscribers.status,
  plan: plans.name,
  profiles: countDistinct(profiles.profileName),
  watchTime: sum(watchSessions.minutesWatched).mapWith(Number),
};

function startOfDay(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

function buildSubscriberConditions(params: ListSubscribersQuery): SQL | undefined {
  return and(
    params.query ? ilike(subscribers.name, `%${params.query}%`) : undefined,
    params.countryCode ? eq(subscribers.countryCode, params.countryCode) : undefined,
    params.status ? eq(subscribers.status, params.status) : undefined,
    params.plan ? eq(subscriptions.planId, params.plan) : undefined,
    params.from ? gte(subscribers.createdAt, startOfDay(params.from)) : undefined,
    params.to ? lt(subscribers.createdAt, startOfDay(addDaysToIsoDate(params.to, 1))) : undefined,
  );
}

export async function getSubscribersTotal(params: ListSubscribersQuery): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(subscribers)
    .leftJoin(
      subscriptions,
      and(eq(subscriptions.subscriberId, subscribers.subscriberId), isNull(subscriptions.endDate)),
    )
    .where(buildSubscriberConditions(params));

  return row?.total ?? 0;
}

export type SubscriberListEntry = {
  subscriberId: string;
  name: string;
  email: string;
  createdAt: Date;
  status: SubscriberStatus;
  planName: string | null;
  profiles: Profile[];
  minutesWatched: number;
};

export async function listSubscribers(params: ListSubscribersQuery): Promise<SubscriberListEntry[]> {

  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = SUBSCRIBER_SORT_COLUMNS[params.sortBy];

  const rows = await db
    .select({
      subscriberId: subscribers.subscriberId,
      name: subscribers.name,
      email: subscribers.email,
      createdAt: subscribers.createdAt,
      status: subscribers.status,
      planName: plans.name,
      minutesWatched: sum(watchSessions.minutesWatched).mapWith(Number),
    })
    .from(subscribers)
    .leftJoin(
      subscriptions,
      and(eq(subscriptions.subscriberId, subscribers.subscriberId), isNull(subscriptions.endDate)),
    )
    .leftJoin(plans, eq(plans.planId, subscriptions.planId))
    .leftJoin(profiles, eq(profiles.subscriberId, subscribers.subscriberId))
    .leftJoin(
      watchSessions,
      and(
        eq(watchSessions.subscriberId, profiles.subscriberId),
        eq(watchSessions.profileName, profiles.profileName),
      ),
    )
    .where(buildSubscriberConditions(params))
    .groupBy(subscribers.subscriberId, plans.planId)
    .orderBy(
      direction(isNotNull(sortColumn)),   
      direction(sortColumn),             
      subscribers.subscriberId, 
    )
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);

  if (rows.length === 0) return [];

  const profileRows = await db
    .select()
    .from(profiles)
    .where(inArray(profiles.subscriberId, rows.map((row) => row.subscriberId)))
    .orderBy(desc(profiles.isDefault), profiles.profileName);

  const profilesBySubscriber = Map.groupBy(profileRows, (profile) => profile.subscriberId);

  return rows.map((row) => ({
    subscriberId: row.subscriberId,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
    status: row.status,
    planName: row.planName,
    profiles: profilesBySubscriber.get(row.subscriberId) ?? [],
    minutesWatched: row.minutesWatched ?? 0,
  }));
}

export type SubscriberFilterOptions = {
  countries: { countryCode: string; name: string }[];
  plans: { planId: string; name: string }[];
};

export async function getSubscriberFilterOptions(): Promise<SubscriberFilterOptions> {
  const [countryRows, planRows] = await Promise.all([
    db
      .selectDistinct({ countryCode: countries.countryCode, name: countries.name })
      .from(countries)
      .innerJoin(subscribers, eq(subscribers.countryCode, countries.countryCode))
      .orderBy(countries.name),

    db.select({ planId: plans.planId, name: plans.name }).from(plans).orderBy(plans.monthlyPriceCents),
  ]);

  return { 
    countries: countryRows, 
    plans: planRows 
  };
}
