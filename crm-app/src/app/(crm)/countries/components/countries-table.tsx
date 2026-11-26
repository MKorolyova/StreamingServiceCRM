"use client";

import Link from "next/link";

import { formatCount, formatMoney, formatPercent, formatWatchTime } from "@/lib/format";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

import { SortableHead } from "../../../../components/sortable-head";

import type { ListCountriesQuery } from "@/types/countries";
import type { CountryListEntry } from "../queries";


type CountriesTableProps = {
  countriesEntries: CountryListEntry[];
  sortBy: ListCountriesQuery["sortBy"];
  sortDir: ListCountriesQuery["sortDir"];
  canViewSubscribers: boolean;
};

export function CountriesTable({ countriesEntries, sortBy, sortDir, canViewSubscribers }: CountriesTableProps) {
  return (
    <div className="border">
      <Table aria-label="Subscribers, revenue, watch time and most popular plan per country">

        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="name" label="Country" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="subscribers" label="Subscribers" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="active" label="Active" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="revenue" label="Revenue" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="watchTime" label="Watch time" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="plan" label="Most popular plan" sortBy={sortBy} sortDir={sortDir} />
          </TableRow>
        </TableHeader>

        <TableBody>

          {countriesEntries.map((row) => (
            <TableRow key={row.countryCode} className="border-dashed">

              <TableCell className="px-3 py-3 font-medium">
                  {row.name}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatCount(row.subscribers)}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatCount(row.activeSubscribers)}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatMoney(row.revenueCents, row.currencyCode)}
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatWatchTime(row.minutesWatched)}
              </TableCell>

              <TableCell className="px-3">
                {row.topPlanName ? (
                  <>
                    {row.topPlanName}
                    <span className="text-muted-foreground">
                      {" "}
                      · {formatPercent(row.topPlanSubscribers / row.planSubscribers, 0)} of running plans
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No running plans</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
