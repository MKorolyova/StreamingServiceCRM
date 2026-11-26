import type { Metadata } from "next";
import { requireAuthContext } from "@/lib/auth/auth-context";
import type { ListPromoCodesQuery } from "@/types/promo-codes";
import type { PageSearchParams } from "@/types/search-params";
import { paginationPromoCodesSchema } from "@/validators/promo-codes";
import { PromoCodesListTab } from "../components/promo-codes-all-promo-codes-tab";

export const metadata: Metadata = { title: "Promo codes · Streaming CRM" };

export default async function PromoCodesPage({ searchParams }: { searchParams: PageSearchParams }) {

  const context = await requireAuthContext();
  context.requirePermission("promoCodes.view");
  const params: ListPromoCodesQuery = paginationPromoCodesSchema.safeParse(await searchParams).data ?? paginationPromoCodesSchema.parse({});

  return (
    <div className="px-2 py-2">
        <PromoCodesListTab params={params} />
    </div>
  );
}
