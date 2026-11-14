import { Check } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="relative gap-3 pb-3">
      <Corners className="size-3" />
      <CardContent>
        <Card className="bg-background [--card-spacing:--spacing(6)]">
          <CardHeader>
            <CardTitle className="tracking-tight">Overview</CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="border-dashed px-2.5 font-mono text-[0.7rem] font-normal tracking-wider text-muted-foreground uppercase"
              >
                Last 30 days
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {SAMPLE_STATS.map((stat) => (
                <Card key={stat.title} className="gap-1 border border-dashed bg-transparent ring-0">
                  <CardHeader>
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="mt-1 text-2xl tracking-tight tabular-nums">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">{stat.note}</CardContent>
                </Card>
              ))}
            </div>

            <Card className="border border-dashed bg-transparent ring-0">
              <CardHeader>
                <CardDescription>Hours watched, thousands per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex h-40 items-end gap-2 sm:gap-3">
                  {SAMPLE_HOURS.map((entry) => (
                    <li key={entry.day} className="flex h-full flex-1 flex-col items-center gap-2">
                      <span className="flex w-full flex-1 items-end pt-6">
                        <span
                          className={cn("relative w-full", entry.hours === MAX_HOURS ? "bg-primary" : "bg-primary/25")}
                          style={{ height: `${Math.round((entry.hours / MAX_HOURS) * 100)}%` }}
                        >
                          <span className="absolute inset-x-0 -top-5 text-center text-xs text-muted-foreground tabular-nums">
                            {entry.hours}
                          </span>
                        </span>
                      </span>
                      <span className="font-mono text-[0.7rem] text-muted-foreground uppercase">{entry.day}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </CardContent>
      <p className="text-center text-xs text-muted-foreground">Illustration with sample data</p>
    </Card>
  );
}

export function AnalyticsSection() {
  return (
    <section id="analytics" className="scroll-mt-16 px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div>
          <BracketLabel>Easy Analytics</BracketLabel>
          <h2 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
            Answers in a glance, not a query
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            The numbers your team asks about every morning are already on the page, in plain
            language, with last month right beside them.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-primary text-primary-foreground">
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
