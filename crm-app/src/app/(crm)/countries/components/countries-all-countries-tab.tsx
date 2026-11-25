import Link from "next/link";
import { redirect } from "next/navigation";
import { Globe, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FilterSelect } from "../../../../components/filter-select";
import { SearchField } from "../../../components/search-field";
import { ListPagination } from "../../../components/list-pagination";
import { Corners } from "../../../components/landing-primitives";

import { CountriesTable } from "./countries-table";

import type { ListCountriesQuery } from "@/types/countries";
import { getCountriesTotal, getCountryFilterOptions, listCountries } from "../queries";


function countriesHref(params: Partial<ListCountriesQuery>): string {

  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  if (params.query) search.set("query", params.query);
  if (params.plan) search.set("plan", params.plan);

  return `/countries?${search}`;
}

type CountriesListTabProps = {
  params: ListCountriesQuery;
  canViewSubscribers: boolean;
};

export async function CountriesListTab({ params, canViewSubscribers }: CountriesListTabProps) {

  const [countriesEntries, countriesTotal, filterOptions] = await Promise.all([
    listCountries(params),
    getCountriesTotal(params),
    getCountryFilterOptions(),
  ]);

  if (countriesTotal > 0 && countriesEntries.length === 0) {
    redirect(countriesHref({ ...params, page: Math.ceil(countriesTotal / params.pageSize) }));
  }

  const hasFilters = Boolean(params.plan);
  const hasSearch = Boolean(params.query);

  if (countriesTotal === 0 && !hasFilters && !hasSearch) {
    return (
      <EmptyState
        icon={Globe}
        title="No subscribers yet"
        description="Country numbers fill in as soon as the first subscribers are created."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">

      <Card size="sm" className="relative rounded-none bg-background lg:sticky lg:top-6">
        <Corners className="text-primary" />

        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">

          <FilterSelect
            param="plan"
            label="Most popular plan"
            allLabel="All plans"
            options={filterOptions.plans.map((plan) => ({ value: plan.planId, label: plan.name }))}
          />

          {hasFilters && (
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={countriesHref({ pageSize: params.pageSize, query: params.query, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">

        <SearchField label="Search by name" placeholder="Country name" className="sm:max-w-none" />

        <p className="text-sm text-muted-foreground">
          Revenue is the sum of paid payments in the country&apos;s own currency; it is not converted.
        </p>

        {countriesTotal === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No countries match"
            description="No country with subscribers fits this search and these filters. Clear them to see more."
          >
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={countriesHref({ pageSize: params.pageSize, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear search and filters
            </Button>
          </EmptyState>

        ) : (
          <>
            <CountriesTable
              countriesEntries={countriesEntries}
              sortBy={params.sortBy}
              sortDir={params.sortDir}
              canViewSubscribers={canViewSubscribers}
            />
            <ListPagination
              page={params.page}
              pageSize={params.pageSize}
              total={countriesTotal}
              hrefForPage={(target) => countriesHref({ ...params, page: target })}
            />
          </>
        )}
      </div>
    </div>
  );
}
