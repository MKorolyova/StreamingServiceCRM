"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

import { formatDateOnly, formatWatchTime } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

import { SortableHead } from "../../../../components/sortable-head";

import { SubscriberProfiles } from "./subscriber-profiles";
import { SubscriberStatusBadge } from "./subscriber-status-badge";

import type { ListSubscribersQuery } from "@/types/subscribers";
import type { SubscriberListEntry } from "../queries";


const COLUMN_COUNT = 7;

type SubscribersTableProps = {
  subscribersEntries: SubscriberListEntry[];
  sortBy: ListSubscribersQuery["sortBy"];
  sortDir: ListSubscribersQuery["sortDir"];
};

export function SubscribersTable({ subscribersEntries, sortBy, sortDir }: SubscribersTableProps) {

  const [expandedSubscriberId, setExpandedSubscriberId] = useState<string | null>(null);

  return (
    <div className="border">
      <Table>

        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="name" label="Name" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="email" label="Email" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="created" label="Created" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="status" label="Status" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="plan" label="Plan" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="profiles" label="Profiles" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="watchTime" label="Watch time" sortBy={sortBy} sortDir={sortDir} align="right" />
          </TableRow>
        </TableHeader>

        <TableBody>

          {subscribersEntries.map((row) => {
            const isExpanded = expandedSubscriberId === row.subscriberId;
            const detailsId = `details-${row.subscriberId}`;

            return (
              <Fragment key={row.subscriberId}>

                <TableRow className={cn("border-dashed", isExpanded && "border-b-0 bg-muted/50 hover:bg-muted/50")}>

                  <TableCell className="px-3 py-3 font-medium">
                    <Link href={`/subscribers/${row.subscriberId}`} className="underline-offset-4 hover:underline">
                      {row.name}
                    </Link>
                  </TableCell>

                  <TableCell className="px-3 text-muted-foreground">
                    {row.email}
                  </TableCell>

                  <TableCell className="px-3 tabular-nums">
                    {formatDateOnly(row.createdAt.toISOString().slice(0, 10))}
                  </TableCell>

                  <TableCell className="px-3">
                    <SubscriberStatusBadge status={row.status} />
                  </TableCell>

                  <TableCell className="px-3">
                    {row.planName ?? <span className="text-muted-foreground">No plan</span>}
                  </TableCell>

                  <TableCell className="px-3">
                    {row.profiles.length === 0 ? (
                      <span className="text-muted-foreground">No profiles</span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed font-normal tabular-nums"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => setExpandedSubscriberId(isExpanded ? null : row.subscriberId)}
                      >
                        {row.profiles.length} {row.profiles.length === 1 ? "profile" : "profiles"}
                        <ChevronDown
                          data-icon="inline-end"
                          aria-hidden
                          className={cn("transition-transform", isExpanded && "rotate-180")}
                        />
                      </Button>
                    )}
                  </TableCell>

                  <TableCell className="px-3 text-right tabular-nums">
                    {formatWatchTime(row.minutesWatched)}
                  </TableCell>
                </TableRow>

                {isExpanded && (
                  <TableRow id={detailsId} className="border-dashed bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={COLUMN_COUNT} className="px-3 pt-0 pb-4 whitespace-normal">
                      <div className="border border-dashed bg-background px-3 py-1">
                        <SubscriberProfiles profiles={row.profiles} />
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
