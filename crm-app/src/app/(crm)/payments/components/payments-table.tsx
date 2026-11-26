"use client";

import Link from "next/link";

import { formatDateOnly, formatEnumLabel, formatMoney } from "@/lib/format";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

import { SortableHead } from "../../../../components/sortable-head";

import { PaymentStatusBadge } from "./payment-status-badge";

import type { ListPaymentsQuery } from "@/types/payments";
import type { PaymentListEntry } from "../queries";


type PaymentsTableProps = {
  paymentsEntries: PaymentListEntry[];
  sortBy: ListPaymentsQuery["sortBy"];
  sortDir: ListPaymentsQuery["sortDir"];
  canViewSubscribers: boolean;
};

export function PaymentsTable({ paymentsEntries, sortBy, sortDir, canViewSubscribers }: PaymentsTableProps) {
  return (
    <div className="border">
      <Table aria-label="Payments">

        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="subscriber" label="Subscriber" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="email" label="Email" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="created" label="Date" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="method" label="Method" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="status" label="Status" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="amount" label="Amount" sortBy={sortBy} sortDir={sortDir} align="right" />
          </TableRow>
        </TableHeader>

        <TableBody>

          {paymentsEntries.map((row) => (
            <TableRow key={row.paymentId} className="border-dashed">

              <TableCell className="px-3 py-3 font-medium">
                {canViewSubscribers ? (
                  <Link href={`/subscribers/${row.subscriberId}`} className="underline-offset-4 hover:underline">
                    {row.subscriberName}
                  </Link>
                ) : (
                  row.subscriberName
                )}
              </TableCell>

              <TableCell className="px-3 text-muted-foreground">
                {row.subscriberEmail}
              </TableCell>

              <TableCell className="px-3 tabular-nums">
                {formatDateOnly(row.createdAt.toISOString().slice(0, 10))}
              </TableCell>

              <TableCell className="px-3">
                {formatEnumLabel(row.method)}
              </TableCell>

              <TableCell className="px-3">
                <PaymentStatusBadge status={row.status} />
              </TableCell>

              <TableCell className="px-3 text-right tabular-nums">
                {formatMoney(row.amountCents, row.currencyCode)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
