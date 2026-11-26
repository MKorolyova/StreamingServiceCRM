import { and, asc, count, desc, eq, gte, ilike, lt, lte, sum, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { countries, payments, plans, subscribers, subscriptions } from "@/db/schema";
import { addDaysToIsoDate, startOfUtcDay } from "@/lib/dates";
import type { ListPaymentsQuery, PaymentStatus } from "@/types/payments";

export async function getPaymentCount(): Promise<number> {
  return db.$count(payments);
}

export type PlanCountryRevenue = {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  planName: string | null;
  paidPayments: number;
  revenueCents: number;
};

export async function listRevenueByPlanAndCountry(): Promise<PlanCountryRevenue[]> {
  const planAtPayment = db
    .select({
      subscriberId: subscriptions.subscriberId,
      planName: plans.name,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(plans.planId, subscriptions.planId))
    .where(
      and(
        eq(subscriptions.subscriberId, payments.subscriberId),
        lte(subscriptions.startDate, payments.createdAt),
      ),
    )
    .orderBy(desc(subscriptions.startDate))
    .limit(1)
    .as("plan_at_payment");

  return db
    .select({
      countryCode: countries.countryCode,
      countryName: countries.name,
      currencyCode: countries.currencyCode,
      planName: planAtPayment.planName,
      paidPayments: count(),
      revenueCents: sum(payments.amountCents).mapWith(Number),
    })
    .from(payments)
    .innerJoin(subscribers, eq(subscribers.subscriberId, payments.subscriberId))
    .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
    .leftJoinLateral(planAtPayment, eq(planAtPayment.subscriberId, payments.subscriberId))
    .where(eq(payments.status, "PAID"))
    .groupBy(countries.countryCode, countries.name, countries.currencyCode, planAtPayment.planName)
    .orderBy(countries.name);
}

export async function getPaymentsTotal(params: ListPaymentsQuery): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(payments)
    .innerJoin(subscribers, eq(subscribers.subscriberId, payments.subscriberId))
    .where(buildPaymentConditions(params));

  return row?.total ?? 0;
}

const PAYMENT_SORT_COLUMNS: Record<ListPaymentsQuery["sortBy"], PgColumn> = {
  subscriber: subscribers.name,
  email: subscribers.email,
  created: payments.createdAt,
  method: payments.method,
  status: payments.status,
  amount: payments.amountCents,
};

function buildPaymentConditions(params: ListPaymentsQuery): SQL | undefined {
  return and(
    params.query ? ilike(subscribers.name, `%${params.query}%`) : undefined,
    params.countryCode ? eq(subscribers.countryCode, params.countryCode) : undefined,
    params.method ? eq(payments.method, params.method) : undefined,
    params.status ? eq(payments.status, params.status) : undefined,
    params.from ? gte(payments.createdAt, startOfUtcDay(params.from)) : undefined,
    params.to ? lt(payments.createdAt, startOfUtcDay(addDaysToIsoDate(params.to, 1))) : undefined,
  );
}

export type PaymentListEntry = {
  paymentId: string;
  amountCents: number;
  createdAt: Date;
  method: string;
  status: PaymentStatus;
  subscriberId: string;
  subscriberName: string;
  subscriberEmail: string;
  currencyCode: string;
};

export async function listPayments(params: ListPaymentsQuery): Promise<PaymentListEntry[]> {

  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = PAYMENT_SORT_COLUMNS[params.sortBy];

  return db
    .select({
      paymentId: payments.paymentId,
      amountCents: payments.amountCents,
      createdAt: payments.createdAt,
      method: payments.method,
      status: payments.status,
      subscriberId: payments.subscriberId,
      subscriberName: subscribers.name,
      subscriberEmail: subscribers.email,
      currencyCode: countries.currencyCode,
    })
    .from(payments)
    .innerJoin(subscribers, eq(subscribers.subscriberId, payments.subscriberId))
    .innerJoin(countries, eq(countries.countryCode, subscribers.countryCode))
    .where(buildPaymentConditions(params))
    .orderBy(
      direction(sortColumn),
      desc(payments.createdAt),
      payments.paymentId,
    )
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);
}

export type PaymentFilterOptions = {
  countries: { countryCode: string; name: string }[];
  methods: string[];
};

export async function getPaymentFilterOptions(): Promise<PaymentFilterOptions> {
  const [countryRows, methodRows] = await Promise.all([
    db
      .selectDistinct({ countryCode: countries.countryCode, name: countries.name })
      .from(countries)
      .innerJoin(subscribers, eq(subscribers.countryCode, countries.countryCode))
      .innerJoin(payments, eq(payments.subscriberId, subscribers.subscriberId))
      .orderBy(countries.name),

    db.selectDistinct({ method: payments.method }).from(payments).orderBy(payments.method),
  ]);

  return {
    countries: countryRows,
    methods: methodRows.map((row) => row.method),
  };
}
