import { and, asc, count, desc, eq, ilike, isNotNull, isNull, sum, type SQL, type SQLWrapper } from "drizzle-orm";
import { db } from "@/db";
import { countries, payments, plans, subscribers, subscriptions, watchSessions } from "@/db/schema";
import type { ListCountriesQuery } from "@/types/countries";

const countrySubscribers = db
  .select({
    countryCode: subscribers.countryCode,
    total: count().as("subscriber_total"),
  })
  .from(subscribers)
  .groupBy(subscribers.countryCode)
  .as("country_subscribers");

const activeSubscribers = db
  .select({
    countryCode: subscribers.countryCode,
    total: count().as("active_total"),
  })
  .from(subscribers)
  .where(eq(subscribers.status, "ACTIVE"))
  .groupBy(subscribers.countryCode)
  .as("active_subscribers");

const revenue = db
  .select({
    countryCode: subscribers.countryCode,
    cents: sum(payments.amountCents).mapWith(Number).as("revenue_cents"),
  })
  .from(payments)
  .innerJoin(subscribers, eq(subscribers.subscriberId, payments.subscriberId))
  .where(eq(payments.status, "PAID"))
  .groupBy(subscribers.countryCode)
  .as("revenue");

const viewing = db
  .select({
    countryCode: subscribers.countryCode,
    minutes: sum(watchSessions.minutesWatched).mapWith(Number).as("viewing_minutes"),
  })
  .from(watchSessions)
  .innerJoin(subscribers, eq(subscribers.subscriberId, watchSessions.subscriberId))
  .groupBy(subscribers.countryCode)
  .as("viewing");

const runningPlans = db
  .select({
    countryCode: subscribers.countryCode,
    total: count().as("running_plan_total"),
  })
  .from(subscriptions)
  .innerJoin(subscribers, eq(subscribers.subscriberId, subscriptions.subscriberId))
  .where(isNull(subscriptions.endDate))
  .groupBy(subscribers.countryCode)
  .as("running_plans");

const topPlans = db
  .selectDistinctOn([subscribers.countryCode], {
    countryCode: subscribers.countryCode,
    planId: plans.planId,
    planName: plans.name,
    subscribers: count().as("top_plan_subscribers"),
  })
  .from(subscriptions)
  .innerJoin(subscribers, eq(subscribers.subscriberId, subscriptions.subscriberId))
  .innerJoin(plans, eq(plans.planId, subscriptions.planId))
  .where(isNull(subscriptions.endDate))
  .groupBy(subscribers.countryCode, plans.planId)
  .orderBy(subscribers.countryCode, desc(count()), plans.monthlyPriceCents, plans.planId)
  .as("top_plans");

export async function getCountriesTotal(params: ListCountriesQuery): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(countries)
    .innerJoin(countrySubscribers, eq(countrySubscribers.countryCode, countries.countryCode))
    .leftJoin(topPlans, eq(topPlans.countryCode, countries.countryCode))
    .where(buildCountryConditions(params));

  return row?.total ?? 0;
}

const COUNTRY_SORT_COLUMNS: Record<ListCountriesQuery["sortBy"], SQLWrapper> = {
  name: countries.name,
  subscribers: countrySubscribers.total,
  active: activeSubscribers.total,
  revenue: revenue.cents,
  watchTime: viewing.minutes,
  plan: topPlans.planName,
};

function buildCountryConditions(params: ListCountriesQuery): SQL | undefined {
  return and(
    params.query ? ilike(countries.name, `%${params.query}%`) : undefined,
    params.plan ? eq(topPlans.planId, params.plan) : undefined,
  );
}

export type CountryListEntry = {
  countryCode: string;
  name: string;
  currencyCode: string;
  subscribers: number;
  activeSubscribers: number;
  revenueCents: number;
  minutesWatched: number;
  topPlanName: string | null;
  topPlanSubscribers: number;
  planSubscribers: number;
};

export async function listCountries(params: ListCountriesQuery): Promise<CountryListEntry[]> {

  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = COUNTRY_SORT_COLUMNS[params.sortBy];

  const rows = await db
    .select({
      countryCode: countries.countryCode,
      name: countries.name,
      currencyCode: countries.currencyCode,
      subscribers: countrySubscribers.total,
      activeSubscribers: activeSubscribers.total,
      revenueCents: revenue.cents,
      minutesWatched: viewing.minutes,
      topPlanName: topPlans.planName,
      topPlanSubscribers: topPlans.subscribers,
      planSubscribers: runningPlans.total,
    })
    .from(countries)
    .innerJoin(countrySubscribers, eq(countrySubscribers.countryCode, countries.countryCode))
    .leftJoin(activeSubscribers, eq(activeSubscribers.countryCode, countries.countryCode))
    .leftJoin(revenue, eq(revenue.countryCode, countries.countryCode))
    .leftJoin(viewing, eq(viewing.countryCode, countries.countryCode))
    .leftJoin(runningPlans, eq(runningPlans.countryCode, countries.countryCode))
    .leftJoin(topPlans, eq(topPlans.countryCode, countries.countryCode))
    .where(buildCountryConditions(params))
    .orderBy(
      direction(isNotNull(sortColumn)),
      direction(sortColumn),
      countries.name,
    )
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);

  return rows.map((row) => ({
    countryCode: row.countryCode,
    name: row.name,
    currencyCode: row.currencyCode,
    subscribers: row.subscribers,
    activeSubscribers: row.activeSubscribers ?? 0,
    revenueCents: row.revenueCents ?? 0,
    minutesWatched: row.minutesWatched ?? 0,
    topPlanName: row.topPlanName,
    topPlanSubscribers: row.topPlanSubscribers ?? 0,
    planSubscribers: row.planSubscribers ?? 0,
  }));
}

export type CountryFilterOptions = {
  plans: { planId: string; name: string }[];
};

export async function getCountryFilterOptions(): Promise<CountryFilterOptions> {
  const planRows = await db
    .select({ planId: plans.planId, name: plans.name })
    .from(plans)
    .orderBy(plans.monthlyPriceCents);

  return {
    plans: planRows,
  };
}