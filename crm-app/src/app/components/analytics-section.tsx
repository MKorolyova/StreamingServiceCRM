import { Check } from "lucide-react";

import { BracketLabel, Corners } from "./landing-primitives";

const POINTS = [
  "Subscribers, revenue, hours watched and churn on one overview",
  "Every number links back to the records behind it",
  "Campaign results from sent to redeemed, without a spreadsheet",
];

const SAMPLE_STATS = [
  { title: "Active subscribers", value: "12,480", note: "+3.2% vs last month" },
  { title: "Monthly revenue", value: "$148,920", note: "+1.8% vs last month" },
  { title: "Churn rate", value: "2.4%", note: "Down from 2.7%" },
];

const SAMPLE_HOURS = [
  { day: "Mon", hours: 9.8 },
  { day: "Tue", hours: 10.4 },
  { day: "Wed", hours: 11.1 },
  { day: "Thu", hours: 10.9 },
  { day: "Fri", hours: 13.6 },
  { day: "Sat", hours: 16.2 },
  { day: "Sun", hours: 14.3 },
];

const MAX_HOURS = Math.max(...SAMPLE_HOURS.map((entry) => entry.hours));

/** Illustrative dashboard built from sample figures. */
function DashboardPreview() {
  return (
    <figure className="relative border border-forest/25 bg-forest/[0.04] p-3 sm:p-4">
      <Corners className="size-3" />
      <div className="border border-forest/20 bg-lemongrass p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium tracking-tight">Overview</p>
          <p className="border border-dashed border-forest/45 px-2.5 py-0.5 font-mono text-[0.7rem] tracking-wider uppercase opacity-70">
            Last 30 days
          </p>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {SAMPLE_STATS.map((stat) => (
            <div key={stat.title} className="border border-dashed border-forest/40 p-4">
              <dt className="text-sm opacity-70">{stat.title}</dt>
              <dd className="mt-2 text-2xl font-medium tracking-tight tabular-nums">{stat.value}</dd>
              <dd className="mt-1 text-xs opacity-60">{stat.note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 border border-dashed border-forest/40 p-4">
          <p className="text-sm opacity-70">Hours watched, thousands per day</p>
          <ul className="mt-5 flex h-40 items-end gap-2 sm:gap-3">
            {SAMPLE_HOURS.map((entry) => (
              <li key={entry.day} className="flex h-full flex-1 flex-col items-center gap-2">
                <span className="flex w-full flex-1 items-end pt-6">
                  <span
                    className={`relative w-full ${entry.hours === MAX_HOURS ? "bg-forest" : "bg-forest/25"}`}
                    style={{ height: `${Math.round((entry.hours / MAX_HOURS) * 100)}%` }}
                  >
                    <span className="absolute inset-x-0 -top-5 text-center text-xs tabular-nums opacity-70">
                      {entry.hours}
                    </span>
                  </span>
                </span>
                <span className="font-mono text-[0.7rem] uppercase opacity-60">{entry.day}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="px-2 pt-3 text-center text-xs opacity-60">
        Illustration with sample data
      </figcaption>
    </figure>
  );
}

export function AnalyticsSection() {
  return (
    <section id="analytics" className="scroll-mt-16 border-t border-dashed border-forest/35 px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div>
          <BracketLabel>Easy Analytics</BracketLabel>
          <h2 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
            Answers in a glance, not a query
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed opacity-80">
            The numbers your team asks about every morning are already on the page, in plain
            language, with last month right beside them.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-forest text-lemongrass">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}
