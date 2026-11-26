import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { LIST_PRICE_CURRENCY } from "@/constants/constants";
import { daysBetween } from "@/lib/dates";
import { formatDateOnly, formatMoney } from "@/lib/format";

import type { SubscriptionHistoryEntry } from "../queries";

export function SubscriptionTimeline({ entries }: { entries: SubscriptionHistoryEntry[] }) {
  return (
    <ol className="flex flex-col">
      {entries.map((entry, index) => {
        const isRunning = entry.endDate === null;
        const nextStartDate = entries[index - 1]?.startDate;
        const wasPlanChange = Boolean(entry.endDate && nextStartDate && daysBetween(entry.endDate, nextStartDate) <= 1);

        return (
          <li key={entry.startDate} className="relative flex gap-4 pb-6 last:pb-0">
            <span aria-hidden className="absolute top-3 bottom-0 left-[0.3125rem] border-l border-dashed" />
            <span
              aria-hidden
              className={cn(
                "relative mt-1.5 size-[0.6875rem] shrink-0 border border-primary",
                isRunning ? "bg-primary" : "bg-background",
              )}
            />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{entry.planName}</span>
                <span className="text-muted-foreground tabular-nums">
                  {formatMoney(entry.monthlyPriceCents, LIST_PRICE_CURRENCY)} / month
                </span>
                {isRunning && (
                  <Badge className="px-2.5 font-mono text-[0.7rem] font-normal tracking-wider uppercase">Current</Badge>
                )}
              </p>
              <p className="text-muted-foreground tabular-nums">
                {formatDateOnly(entry.startDate)} – {entry.endDate ? formatDateOnly(entry.endDate) : "today"}
              </p>
              {!isRunning && (
                <p>
                  <span className="text-muted-foreground">{wasPlanChange ? "Moved plan: " : "Canceled: "}</span>
                  {entry.cancelReason ?? "no reason given"}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
