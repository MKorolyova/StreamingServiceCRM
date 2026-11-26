import { cn } from "cn";

import { formatWatchTime } from "@/lib/format";

import type { WatchTimeSlot } from "../queries";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function cellClassName(ratio: number): string {
  if (ratio === 0) return "bg-muted";
  if (ratio >= 0.8) return "bg-primary";
  if (ratio >= 0.6) return "bg-primary/75";
  if (ratio >= 0.4) return "bg-primary/50";
  if (ratio >= 0.2) return "bg-primary/30";
  return "bg-primary/15";
}

const LEGEND_STEPS = [0, 0.1, 0.3, 0.5, 0.7, 0.9];

export function WatchHeatmap({ slots }: { slots: WatchTimeSlot[] }) {
  const minutesBySlot = new Map(slots.map((slot) => [`${slot.dayOfWeek}-${slot.hour}`, slot.minutesWatched]));
  const max = Math.max(...slots.map((slot) => slot.minutesWatched), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-separate border-spacing-0.5 text-xs">
          <caption className="sr-only">Watch time by weekday and hour of day, in UTC</caption>
          <thead>
            <tr className="font-mono text-muted-foreground">
              <td />
              {HOURS.map((hour) => (
                <th key={hour} scope="col" className="pb-1 text-center font-normal tabular-nums">
                  <span className={hour % 3 === 0 ? undefined : "sr-only"}>{String(hour).padStart(2, "0")}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKDAYS.map((weekday, dayOfWeek) => (
              <tr key={weekday}>
                <th
                  scope="row"
                  className="pr-2 text-left font-mono font-normal tracking-[0.14em] text-muted-foreground uppercase"
                >
                  <span aria-hidden>{weekday.slice(0, 3)}</span>
                  <span className="sr-only">{weekday}</span>
                </th>
                {HOURS.map((hour) => {
                  const minutes = minutesBySlot.get(`${dayOfWeek}-${hour}`) ?? 0;
                  const label = `${weekday} ${String(hour).padStart(2, "0")}:00: ${formatWatchTime(minutes)}`;

                  return (
                    <td key={hour} title={label} className={cn("h-7", cellClassName(minutes / max))}>
                      <span className="sr-only">{formatWatchTime(minutes)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-hidden>
        <span>Less</span>
        {LEGEND_STEPS.map((step) => (
          <span key={step} className={cn("size-3.5", cellClassName(step))} />
        ))}
        <span>More</span>
        <span className="ml-auto">Busiest hour: {formatWatchTime(max)}</span>
      </div>
    </div>
  );
}
