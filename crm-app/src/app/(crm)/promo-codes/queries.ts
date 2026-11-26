import { and, asc, count, countDistinct, desc, eq, gte, ilike, isNotNull, isNull, lte, or, sum, type SQL, type SQLWrapper } from "drizzle-orm";
import { PROMO_RETENTION_WINDOW_DAYS } from "@/constants/constants";
import { db } from "@/db";
import { plans, promoCodeRedemptions, promoCodes, subscriptions } from "@/db/schema";
import { addDaysToIsoDate, daysBetween, toIsoDate } from "@/lib/dates";
import { addDaysTo, daysApart } from "@/lib/sql-dates";
import { percentOf } from "@/lib/sql-rates";
import type { ListPromoCodesQuery } from "@/types/promo-codes";
import { needsAttention } from "./promo-code-flags";

const redemptionDiscounts = db
  .selectDistinctOn([promoCodeRedemptions.subscriberId, promoCodeRedemptions.code], {
    code: promoCodeRedemptions.code,
    discountCents: percentOf(plans.monthlyPriceCents, promoCodes.discountPercent).as("discount_cents"),
  })
  .from(promoCodeRedemptions)
  .innerJoin(promoCodes, eq(promoCodes.code, promoCodeRedemptions.code))
  .leftJoin(subscriptions, eq(subscriptions.subscriberId, promoCodeRedemptions.subscriberId))
  .leftJoin(plans, eq(plans.planId, subscriptions.planId))
  .orderBy(
    promoCodeRedemptions.subscriberId,
    promoCodeRedemptions.code,
    desc(
      and(
        lte(subscriptions.startDate, promoCodeRedemptions.redeemedDate),
        or(isNull(subscriptions.endDate), gte(subscriptions.endDate, promoCodeRedemptions.redeemedDate)),
      ) as SQL,
    ),
    daysApart(subscriptions.startDate, promoCodeRedemptions.redeemedDate),
  )
  .as("redemption_discounts");

const codeUsage = db
  .select({
    code: redemptionDiscounts.code,
    uses: count().as("uses"),
    discountCents: sum(redemptionDiscounts.discountCents).mapWith(Number).as("given_away_cents"),
  })
  .from(redemptionDiscounts)
  .groupBy(redemptionDiscounts.code)
  .as("code_usage");

export async function getPromoCodesTotal(params: ListPromoCodesQuery): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(promoCodes)
    .where(buildPromoCodeConditions(params));

  return row?.total ?? 0;
}

const PROMO_CODE_SORT_COLUMNS: Record<ListPromoCodesQuery["sortBy"], SQLWrapper> = {
  code: promoCodes.code,
  discount: promoCodes.discountPercent,
  uses: codeUsage.uses,
  expiry: promoCodes.expiryDate,
  givenAway: codeUsage.discountCents,
};

function buildPromoCodeConditions(params: ListPromoCodesQuery): SQL | undefined {
  return params.query ? ilike(promoCodes.code, `%${params.query}%`) : undefined;
}

export type PromoCodeListEntry = {
  code: string;
  discountPercent: number;
  maxUses: number;
  expiryDate: string;
  daysUntilExpiry: number;
  uses: number;
  discountCents: number;
};

type PromoCodeUsageRow = {
  code: string;
  discountPercent: number;
  maxUses: number;
  expiryDate: string;
  uses: number | null;
  discountCents: number | null;
};

const promoCodeUsageColumns = {
  code: promoCodes.code,
  discountPercent: promoCodes.discountPercent,
  maxUses: promoCodes.maxUses,
  expiryDate: promoCodes.expiryDate,
  uses: codeUsage.uses,
  discountCents: codeUsage.discountCents,
};

function toPromoCodeListEntry(row: PromoCodeUsageRow, today: string): PromoCodeListEntry {
  return {
    code: row.code,
    discountPercent: row.discountPercent,
    maxUses: row.maxUses,
    expiryDate: row.expiryDate,
    daysUntilExpiry: daysBetween(today, row.expiryDate),
    uses: row.uses ?? 0,
    discountCents: Math.round(row.discountCents ?? 0),
  };
}

export async function listPromoCodes(params: ListPromoCodesQuery): Promise<PromoCodeListEntry[]> {

  const direction = params.sortDir === "asc" ? asc : desc;
  const sortColumn = PROMO_CODE_SORT_COLUMNS[params.sortBy];

  const rows = await db
    .select(promoCodeUsageColumns)
    .from(promoCodes)
    .leftJoin(codeUsage, eq(codeUsage.code, promoCodes.code))
    .where(buildPromoCodeConditions(params))
    .orderBy(
      direction(isNotNull(sortColumn)),
      direction(sortColumn),
      promoCodes.code,
    )
    .limit(params.pageSize)
    .offset((params.page - 1) * params.pageSize);

  const today = toIsoDate(new Date());

  return rows.map((row) => toPromoCodeListEntry(row, today));
}

export type PromoCodesSummary = {
  codes: number;
  redemptions: number;
  discountCents: number;
  needAttention: number;
  redeemers: number;
  stayedAfterDiscount: number;
};

export async function getPromoCodesSummary(): Promise<PromoCodesSummary> {

  const today = toIsoDate(new Date());
  const latestCountedRedemption = addDaysToIsoDate(today, -PROMO_RETENTION_WINDOW_DAYS);
  const windowEnd = addDaysTo(promoCodeRedemptions.redeemedDate, PROMO_RETENTION_WINDOW_DAYS);

  const [rows, [redeemerRow], [stayedRow]] = await Promise.all([
    db
      .select(promoCodeUsageColumns)
      .from(promoCodes)
      .leftJoin(codeUsage, eq(codeUsage.code, promoCodes.code)),

    db
      .select({ total: countDistinct(promoCodeRedemptions.subscriberId) })
      .from(promoCodeRedemptions)
      .where(lte(promoCodeRedemptions.redeemedDate, latestCountedRedemption)),

    db
      .select({ total: countDistinct(promoCodeRedemptions.subscriberId) })
      .from(promoCodeRedemptions)
      .innerJoin(
        subscriptions,
        and(
          eq(subscriptions.subscriberId, promoCodeRedemptions.subscriberId),
          lte(subscriptions.startDate, windowEnd),
          or(isNull(subscriptions.endDate), gte(subscriptions.endDate, windowEnd)),
        ),
      )
      .where(lte(promoCodeRedemptions.redeemedDate, latestCountedRedemption)),
  ]);

  const entries = rows.map((row) => toPromoCodeListEntry(row, today));

  return {
    codes: entries.length,
    redemptions: entries.reduce((total, entry) => total + entry.uses, 0),
    discountCents: entries.reduce((total, entry) => total + entry.discountCents, 0),
    needAttention: entries.filter(needsAttention).length,
    redeemers: redeemerRow?.total ?? 0,
    stayedAfterDiscount: stayedRow?.total ?? 0,
  };
}
