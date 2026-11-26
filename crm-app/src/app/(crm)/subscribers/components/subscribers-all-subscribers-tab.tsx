import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchX, Users } from "lucide-react";

import { formatEnumLabel } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FilterDate } from "../../../../components/filter-date";
import { FilterSelect } from "../../../../components/filter-select";
import { SearchField } from "../../../components/search-field";
import { ListPagination } from "../../../components/list-pagination";
import { Corners } from "../../../components/landing-primitives";

import { SubscribersTable } from "./subscribers-table";

import { subscriberStatusEnum } from "@/db/schema";

import type { ListSubscribersQuery } from "@/types/subscribers";
import { getSubscriberFilterOptions, getSubscribersTotal, listSubscribers } from "../queries";


function subscribersHref(params: Partial<ListSubscribersQuery>): string {

  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  if (params.query) search.set("query", params.query);
  if (params.status) search.set("status", params.status);
  if (params.countryCode) search.set("countryCode", params.countryCode);
  if (params.plan) search.set("plan", params.plan);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);

  return `/subscribers?${search}`;
}

export async function SubscribersListTab(params: ListSubscribersQuery) {

  const [subscribersEntries, subscribersTotal, filterOptions] = await Promise.all([
    listSubscribers(params),
    getSubscribersTotal(params),
    getSubscriberFilterOptions(),
  ]);

  if (subscribersTotal > 0 && subscribersEntries.length === 0) {
    redirect(subscribersHref({ ...params, page: Math.ceil(subscribersTotal / params.pageSize) }));
  }

  const hasFilters = params.status || params.countryCode || params.plan || params.from || params.to;
  const hasSearch = Boolean(params.query);

  if (subscribersTotal === 0 && !hasFilters && !hasSearch) {
    return (
      <EmptyState
        icon={Users}
        title="No subscribers yet"
        description="Subscribers appear here as soon as the first account is created."
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
            param="countryCode"
            label="Country"
            allLabel="All countries"
            options={filterOptions.countries.map((country) => ({ value: country.countryCode, label: country.name }))}
          />
          
          <FilterSelect
            param="plan"
            label="Plan"
            allLabel="All plans"
            options={filterOptions.plans.map((plan) => ({ value: plan.planId, label: plan.name }))}
          />

          <FilterSelect
            param="status"
            label="Status"
            allLabel="All statuses"
            options={subscriberStatusEnum.enumValues.map((status) => ({ value: status, label: formatEnumLabel(status) }))}
          />

          <FilterDate 
            param="from" 
            label="Signed up from" max={params.to} 
          />

          <FilterDate 
            param="to" 
            label="Signed up to" min={params.from} 
          />

          {hasFilters && (
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={subscribersHref({ pageSize: params.pageSize, query: params.query, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">

        <SearchField label="Search by name" placeholder="Subscriber name" className="sm:max-w-none" />

        {subscribersTotal === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No subscribers match"
            description={"No account fits these filters. Widen the date range or clear a filter to see more."}
          >
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={subscribersHref({ pageSize: params.pageSize, sortBy: params.sortBy, sortDir: params.sortDir})}/>
              }
            >
              {"Clear filters"}
            </Button>
          </EmptyState>

        ) : (
          <>
            <SubscribersTable subscribersEntries={subscribersEntries} sortBy={params.sortBy} sortDir={params.sortDir} />
            <ListPagination
              page={params.page}
              pageSize={params.pageSize}
              total={subscribersTotal}
              hrefForPage={(target) => subscribersHref({ ...params, page: target })}
            />
          </>
        )}
      </div>
    </div>
  );
}
