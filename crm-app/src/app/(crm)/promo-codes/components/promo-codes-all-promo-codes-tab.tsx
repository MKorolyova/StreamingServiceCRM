import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchX, Ticket } from "lucide-react";

import { LIST_PRICE_CURRENCY, PROMO_EXPIRING_SOON_DAYS, PROMO_NEAR_LIMIT_RATIO } from "@/constants/constants";
import { formatCount, formatMoney, formatPercent } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

import { SearchField } from "../../../components/search-field";
import { ListPagination } from "../../../components/list-pagination";
import { StatTile } from "../../../components/stat-tile";

import { PromoCodesTable } from "./promo-codes-table";

import type { ListPromoCodesQuery } from "@/types/promo-codes";
import { getPromoCodesSummary, getPromoCodesTotal, listPromoCodes } from "../queries";


function promoCodesHref(params: Partial<ListPromoCodesQuery>): string {

  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  if (params.query) search.set("query", params.query);

  return `/promo-codes?${search}`;
}

export async function PromoCodesListTab({ params }: { params: ListPromoCodesQuery }) {

  const [promoCodesEntries, promoCodesTotal, summary] = await Promise.all([
    listPromoCodes(params),
    getPromoCodesTotal(params),
    getPromoCodesSummary(),
  ]);

  if (promoCodesTotal > 0 && promoCodesEntries.length === 0) {
    redirect(promoCodesHref({ ...params, page: Math.ceil(promoCodesTotal / params.pageSize) }));
  }

  if (summary.codes === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No promo codes yet"
        description="Codes appear here as soon as the first one is created."
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">

      <section aria-label="Key numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          title="Redemptions"
          value={formatCount(summary.redemptions)}
          note={`Across ${formatCount(summary.codes)} promo codes`}
        />
        <StatTile
          title="Revenue given away"
          value={formatMoney(summary.discountCents, LIST_PRICE_CURRENCY)}
          note="One discounted month per redemption, at list price"
        />
        <StatTile
          title="Need attention"
          value={formatCount(summary.needAttention)}
          note={`Expiring within ${PROMO_EXPIRING_SOON_DAYS} days or past ${PROMO_NEAR_LIMIT_RATIO * 100}% of their uses`}
        />
        <StatTile
          title="Stay after the discount"
          value={formatPercent(summary.redeemers === 0 ? null : summary.stayedAfterDiscount / summary.redeemers, 0)}
          note={
            summary.redeemers === 0
              ? "No redemption is older than a month yet"
              : `${formatCount(summary.stayedAfterDiscount)} of ${formatCount(summary.redeemers)} redeemers kept a plan past the discounted month`
          }
        />
      </section>

      <div className="flex min-w-0 flex-col gap-4">

        <SearchField label="Search by code" placeholder="Promo code" className="sm:max-w-none" />

        {promoCodesTotal === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No promo codes match"
            description="No code contains this text. Check the spelling or clear the search to see every code."
          >
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={promoCodesHref({ pageSize: params.pageSize, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear search
            </Button>
          </EmptyState>

        ) : (
          <>
            <PromoCodesTable promoCodesEntries={promoCodesEntries} sortBy={params.sortBy} sortDir={params.sortDir} />
            <ListPagination
              page={params.page}
              pageSize={params.pageSize}
              total={promoCodesTotal}
              hrefForPage={(target) => promoCodesHref({ ...params, page: target })}
            />
          </>
        )}
      </div>
    </div>
  );
}
