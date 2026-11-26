"use client";

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { formatCount } from "@/lib/format";

export type BarListEntry = {
  label: string;
  value: number;
  /** Formatted value shown at the end of the row. Defaults to the plain number. */
  display?: string;
  /** Smaller line of context under the label. */
  note?: string;
};

type BarListProps = {
  entries: BarListEntry[];
  /** Value that fills the whole track. Defaults to the largest entry; pass 1 for ratios. */
  max?: number;
};

/** Horizontal bars for ranked lists and rates, where labels are too long for vertical bars. */
export function BarList({ entries, max }: BarListProps) {
  const scale = max ?? Math.max(...entries.map((entry) => entry.value), 0);

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((entry) => {
        const percent = scale <= 0 ? 0 : Math.min((entry.value / scale) * 100, 100);
        const display = entry.display ?? formatCount(entry.value);

        return (
          <li key={entry.label}>
            <Progress value={percent} getAriaValueText={() => display} className="items-baseline gap-x-4 gap-y-1.5">
              <ProgressLabel className="min-w-0 flex-1">
                <span className="block truncate">{entry.label}</span>
                {entry.note && (
                  <span className="block truncate text-xs font-normal text-muted-foreground">{entry.note}</span>
                )}
              </ProgressLabel>
              <ProgressValue className="shrink-0 text-foreground">{() => display}</ProgressValue>
            </Progress>
          </li>
        );
      })}
    </ul>
  );
}
