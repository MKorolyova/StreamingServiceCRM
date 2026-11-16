"use client";

import { useState } from "react";
import { ChartNoAxesColumn } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Corners } from "../../../components/landing-primitives";
import { BarChart, type BarChartEntry } from "./bar-chart";

type Measure = "subscribers" | "profiles";

const MEASURES: { value: Measure; label: string }[] = [
  { value: "subscribers", label: "Subscribers" },
  { value: "profiles", label: "Profiles" },
];

export type BreakdownChart = {
  title: string;
  /** Explains what is counted, keyed by the measure being shown. */
  description: Record<Measure, string>;
  entries: { label: string; subscribers: number; profiles: number }[];
};

/** Four bar charts with one switch between counting subscribers and profiles. */
export function SubscriberBreakdown({ charts }: { charts: BreakdownChart[] }) {
  const [measure, setMeasure] = useState<Measure>("subscribers");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">Count on the vertical axis</p>
        <div role="group" aria-label="What the charts count" className="flex border">
          {MEASURES.map((option) => (
            <Button
              key={option.value}
              variant={measure === option.value ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 font-mono text-[0.7rem] font-normal tracking-[0.14em] uppercase"
              aria-pressed={measure === option.value}
              onClick={() => setMeasure(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {charts.map((chart) => {
          const entries: BarChartEntry[] = chart.entries.map((entry) => ({
            label: entry.label,
            value: entry[measure],
          }));

          return (
            <Card key={chart.title} className="relative [--card-spacing:--spacing(6)]">
              <Corners />
              <CardHeader>
                <CardTitle className="text-lg tracking-tight">{chart.title}</CardTitle>
                <CardDescription>{chart.description[measure]}</CardDescription>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <EmptyState
                    icon={ChartNoAxesColumn}
                    title="Nothing to chart yet"
                    description="This chart fills in as soon as there is data behind it."
                    className="py-10"
                  />
                ) : (
                  <BarChart entries={entries} unit={measure} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
