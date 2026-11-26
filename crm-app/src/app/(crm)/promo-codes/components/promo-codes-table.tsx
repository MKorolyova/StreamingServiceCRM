"use client";

import { LIST_PRICE_CURRENCY } from "@/constants/constants";
import { formatCount, formatDateOnly, formatMoney } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { SortableHead } from "../../../../components/sortable-head";

import type { ListPromoCodesQuery } from "@/types/promo-codes";
import type { PromoCodeListEntry } from "../queries";
import { getPromoCodeFlags } from "../promo-code-flags";


function describeExpiry(daysUntilExpiry: number): string {
  if (daysUntilExpiry < 0) return `Expired ${formatCount(-daysUntilExpiry)} days ago`;
  if (daysUntilExpiry === 0) return "Expires today";
  return `${formatCount(daysUntilExpiry)} days left`;
}

type PromoCodesTableProps = {
  promoCodesEntries: PromoCodeListEntry[];
  sortBy: ListPromoCodesQuery["sortBy"];
  sortDir: ListPromoCodesQuery["sortDir"];
};

export function PromoCodesTable({ promoCodesEntries, sortBy, sortDir }: PromoCodesTableProps) {
  return (
    <div className="border">
      <Table aria-label="Every promo code with its uses, expiry and discount given away">

        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="code" label="Code" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="discount" label="Discount" sortBy={sortBy} sortDir={sortDir} align="right" />
            <SortableHead column="uses" label="Uses of maximum" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="expiry" label="Expires" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="givenAway" label="Given away" sortBy={sortBy} sortDir={sortDir} align="right" />
            <TableHead className="h-11 px-3 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {promoCodesEntries.map((row) => {
            const flags = getPromoCodeFlags(row);

            return (
              <TableRow key={row.code} className="border-dashed">

                <TableCell className="px-3 py-3 font-mono font-medium">
                  {row.code}
                </TableCell>

                <TableCell className="px-3 text-right tabular-nums">
                  {row.discountPercent}%
                </TableCell>

                <TableCell className="px-3">
                  <Progress value={row.uses} max={row.maxUses} className="min-w-44 gap-1.5">
                    <ProgressLabel className="text-xs font-normal tabular-nums">
                      {formatCount(row.uses)} of {formatCount(row.maxUses)}
                    </ProgressLabel>
                    <ProgressValue className="text-xs" />
                  </Progress>
                </TableCell>

                <TableCell className="px-3">
                  <span className="flex flex-col">
                    <span className="tabular-nums">{formatDateOnly(row.expiryDate)}</span>
                    <span className="text-xs text-muted-foreground">{describeExpiry(row.daysUntilExpiry)}</span>
                  </span>
                </TableCell>

                <TableCell className="px-3 text-right tabular-nums">
                  {formatMoney(row.discountCents, LIST_PRICE_CURRENCY)}
                </TableCell>

                <TableCell className="px-3">
                  {flags.length === 0 ? (
                    <span className="text-muted-foreground">Active</span>
                  ) : (
                    <span className="flex flex-wrap gap-1.5 px-2.5 font-normal">
                      {flags.map((flag) => (
                        flag
                      ))}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
