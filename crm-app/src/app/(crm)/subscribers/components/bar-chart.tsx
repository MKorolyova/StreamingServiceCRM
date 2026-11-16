import { cn } from "cn";

import { formatCount } from "@/lib/format";

export type BarChartEntry = {
  label: string;
  value: number;
};

type BarChartProps = {
  entries: BarChartEntry[];
  /** What one unit of the value is, such as "subscribers". Used in labels. */
  unit: string;
};

/**
 * Vertical bars for a handful of categories. Every bar carries its value, and
 * hovering or focusing one shows the full label and its share of the total.
 */
export function BarChart({ entries, unit }: BarChartProps) {
  const max = Math.max(...entries.map((entry) => entry.value), 1);
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="overflow-x-auto">
      <ul className="flex h-56 items-stretch" style={{ minWidth: `${entries.length * 3.25}rem` }}>
        {entries.map((entry) => {
          const share = total === 0 ? 0 : Math.round((entry.value / total) * 100);

          return (
            <li
              key={entry.label}
              tabIndex={0}
              aria-label={`${entry.label}: ${formatCount(entry.value)} ${unit}, ${share}% of the total`}
              className="group relative flex min-w-0 flex-1 flex-col items-center gap-2 outline-none"
            >
              {/* No gap between items, so the baseline runs unbroken under every bar. */}
              <span className="flex w-full flex-1 items-end justify-center border-b px-1 pt-6 sm:px-1.5">
                <span
                  className={cn(
                    "relative w-full max-w-16 transition-colors group-hover:bg-primary group-focus-visible:bg-primary",
                    entry.value === max ? "bg-primary" : "bg-primary/25",
                    // Keep a hairline for zero so the category still reads as present.
                    entry.value === 0 && "bg-border",
                  )}
                  style={{ height: entry.value === 0 ? "1px" : `${Math.max((entry.value / max) * 100, 1.5)}%` }}
                >
                  <span className="absolute inset-x-0 -top-5 text-center text-xs text-muted-foreground tabular-nums">
                    {formatCount(entry.value)}
                  </span>
                </span>
              </span>
              <span className="w-full truncate px-1 text-center font-mono text-[0.7rem] text-muted-foreground uppercase">
                {entry.label}
              </span>

              <span
                role="presentation"
                className="pointer-events-none invisible absolute top-0 left-1/2 z-10 w-max max-w-48 -translate-x-1/2 border bg-popover px-2.5 py-1.5 text-center text-xs text-popover-foreground group-hover:visible group-focus-visible:visible"
              >
                <span className="block font-medium">{entry.label}</span>
                <span className="block text-muted-foreground tabular-nums">
                  {formatCount(entry.value)} {unit} · {share}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
