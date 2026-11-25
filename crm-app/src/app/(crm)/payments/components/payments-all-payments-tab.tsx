import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard, SearchX } from "lucide-react";

import { formatEnumLabel } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FilterDate } from "../../../../components/filter-date";
import { FilterSelect } from "../../../../components/filter-select";
import { SearchField } from "../../../components/search-field";
import { ListPagination } from "../../../components/list-pagination";
import { Corners } from "../../../components/landing-primitives";

import { PaymentsTable } from "./payments-table";

import { paymentStatusEnum } from "@/db/schema";

import type { ListPaymentsQuery } from "@/types/payments";
import { getPaymentFilterOptions, getPaymentsTotal, listPayments } from "../queries";


function paymentsHref(params: Partial<ListPaymentsQuery>): string {

  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  if (params.query) search.set("query", params.query);
  if (params.countryCode) search.set("countryCode", params.countryCode);
  if (params.method) search.set("method", params.method);
  if (params.status) search.set("status", params.status);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);

  return `/payments?${search}`;
}

type PaymentsListTabProps = {
  params: ListPaymentsQuery;
  canViewSubscribers: boolean;
};

export async function PaymentsListTab({ params, canViewSubscribers }: PaymentsListTabProps) {

  const [paymentsEntries, paymentsTotal, filterOptions] = await Promise.all([
    listPayments(params),
    getPaymentsTotal(params),
    getPaymentFilterOptions(),
  ]);

  if (paymentsTotal > 0 && paymentsEntries.length === 0) {
    redirect(paymentsHref({ ...params, page: Math.ceil(paymentsTotal / params.pageSize) }));
  }

  const hasFilters = Boolean(params.countryCode || params.method || params.status || params.from || params.to);
  const hasSearch = Boolean(params.query);

  if (paymentsTotal === 0 && !hasFilters && !hasSearch) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Payments appear here as soon as the first one is recorded."
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
            param="method"
            label="Method"
            allLabel="All methods"
            options={filterOptions.methods.map((method) => ({ value: method, label: formatEnumLabel(method) }))}
          />

          <FilterSelect
            param="status"
            label="Status"
            allLabel="All statuses"
            options={paymentStatusEnum.enumValues.map((status) => ({ value: status, label: formatEnumLabel(status) }))}
          />

          <FilterDate
            param="from"
            label="Payment date from" max={params.to}
          />

          <FilterDate
            param="to"
            label="Payment date to" min={params.from}
          />

          {hasFilters && (
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={paymentsHref({ pageSize: params.pageSize, query: params.query, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">

        <SearchField label="Search by name" placeholder="Subscriber name" className="sm:max-w-none" />

        {paymentsTotal === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No payments match"
            description="No payment fits this search and these filters. Widen the date range or clear them to see more."
          >
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={paymentsHref({ pageSize: params.pageSize, sortBy: params.sortBy, sortDir: params.sortDir })}/>
              }
            >
              Clear search and filters
            </Button>
          </EmptyState>

        ) : (
          <>
            <PaymentsTable
              paymentsEntries={paymentsEntries}
              sortBy={params.sortBy}
              sortDir={params.sortDir}
              canViewSubscribers={canViewSubscribers}
            />
            <ListPagination
              page={params.page}
              pageSize={params.pageSize}
              total={paymentsTotal}
              hrefForPage={(target) => paymentsHref({ ...params, page: target })}
            />
          </>
        )}
      </div>
    </div>
  );
}
