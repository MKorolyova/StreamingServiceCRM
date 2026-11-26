import type { Metadata } from "next";
import { requireAuthContext } from "@/lib/auth/auth-context";
import type { ListCountriesQuery } from "@/types/countries";
import type { PageSearchParams } from "@/types/search-params";
import { paginationCountriesSchema } from "@/validators/countries";
import { CountriesListTab } from "../components/countries-all-countries-tab";

export const metadata: Metadata = { title: "Countries · Streaming CRM" };

export default async function CountriesPage({ searchParams }: { searchParams: PageSearchParams }) {

  const context = await requireAuthContext();
  context.requirePermission("reports.view");
  const params: ListCountriesQuery = paginationCountriesSchema.safeParse(await searchParams).data ?? paginationCountriesSchema.parse({});

  return (
    <div className="px-2 py-2">
        <CountriesListTab params={params} canViewSubscribers={context.hasPermission("subscribers.view")} />
    </div>
  );
}
