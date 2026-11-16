"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SubscriberStatus } from "@/types/subscribers";

import { SubscriberPayments, type SubscriberPaymentRow } from "./subscriber-payments";
import { SubscriberProfilesPopover, type SubscriberProfileRow } from "./subscriber-profiles-popover";
import { SubscriberStatusBadge } from "./subscriber-status-badge";

/** A subscriber with every value already formatted for display. */
export type SubscriberRow = {
  subscriberId: string;
  name: string;
  email: string;
  createdDate: string;
  status: SubscriberStatus;
  profiles: SubscriberProfileRow[];
  watchTime: string;
  /** Null when the viewer may not see payments. */
  payments: SubscriberPaymentRow[] | null;
};

const HEADING_CLASS_NAME = "h-11 px-3 font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase";

type SubscribersTableProps = {
  rows: SubscriberRow[];
  showPayments: boolean;
};

export function SubscribersTable({ rows, showPayments }: SubscribersTableProps) {
  const [expandedSubscriberId, setExpandedSubscriberId] = useState<string | null>(null);
  const columnCount = showPayments ? 7 : 6;

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={HEADING_CLASS_NAME}>Name</TableHead>
            <TableHead className={HEADING_CLASS_NAME}>Email</TableHead>
            <TableHead className={HEADING_CLASS_NAME}>Created</TableHead>
            <TableHead className={HEADING_CLASS_NAME}>Status</TableHead>
            <TableHead className={HEADING_CLASS_NAME}>Profiles</TableHead>
            <TableHead className={cn(HEADING_CLASS_NAME, "text-right")}>Watch time</TableHead>
            {showPayments && <TableHead className={HEADING_CLASS_NAME}>Payments</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isExpanded = expandedSubscriberId === row.subscriberId;
            const paymentsId = `payments-${row.subscriberId}`;

            return (
              <Fragment key={row.subscriberId}>
                <TableRow className={cn("border-dashed", isExpanded && "border-b-0 bg-muted/50")}>
                  <TableCell className="px-3 py-3 font-medium">{row.name}</TableCell>
                  <TableCell className="px-3 text-muted-foreground">{row.email}</TableCell>
                  <TableCell className="px-3 tabular-nums">{row.createdDate}</TableCell>
                  <TableCell className="px-3">
                    <SubscriberStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="px-3">
                    <SubscriberProfilesPopover subscriberName={row.name} profiles={row.profiles} />
                  </TableCell>
                  <TableCell className="px-3 text-right tabular-nums">{row.watchTime}</TableCell>
                  {showPayments && row.payments && (
                    <TableCell className="px-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed font-normal tabular-nums"
                        aria-expanded={isExpanded}
                        aria-controls={paymentsId}
                        onClick={() => setExpandedSubscriberId(isExpanded ? null : row.subscriberId)}
                      >
                        {row.payments.length} {row.payments.length === 1 ? "payment" : "payments"}
                        <ChevronDown
                          data-icon="inline-end"
                          aria-hidden
                          className={cn("transition-transform", isExpanded && "rotate-180")}
                        />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>

                {isExpanded && row.payments && (
                  <TableRow id={paymentsId} className="border-dashed bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={columnCount} className="px-3 pt-0 pb-4 whitespace-normal">
                      <div className="border border-dashed bg-background px-3 py-1">
                        <p className="sr-only">Payments of {row.name}</p>
                        <SubscriberPayments payments={row.payments} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
