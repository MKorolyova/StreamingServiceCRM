"use client";

import { Bar, BarChart as RechartsBarChart, Cell, LabelList, XAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCount } from "@/lib/format";

export type BarChartEntry = {
  label: string;
  value: number;
  display?: string;
};

type BarChartProps = {
  entries: BarChartEntry[];
  unit: string;
};

type BarChartRow = {
  label: string;
  value: number;
  display: string;
  share: number;
};

const chartConfig = {
  value: { label: "Value", color: "var(--primary)" },
} satisfies ChartConfig;

const MAX_TICK_LENGTH = 10;

function formatTick(label: string): string {
  return label.length > MAX_TICK_LENGTH ? `${label.slice(0, MAX_TICK_LENGTH - 1)}…` : label;
}

function getBarFill(row: BarChartRow, max: number): string {
  if (row.value === 0) return "var(--border)";
  if (row.value === max) return "var(--color-value)";
  return "color-mix(in oklab, var(--color-value) 25%, transparent)";
}

export function BarChart({ entries, unit }: BarChartProps) {
  const max = Math.max(...entries.map((entry) => entry.value), 1);
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  const rows: BarChartRow[] = entries.map((entry) => ({
    label: entry.label,
    value: entry.value,
    display: entry.display ?? formatCount(entry.value),
    share: total === 0 ? 0 : Math.round((entry.value / total) * 100),
  }));

  return (
    <div className="overflow-x-auto">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-56 w-full"
        style={{ minWidth: `${entries.length * 3.25}rem` }}
      >
        <RechartsBarChart accessibilityLayer data={rows} margin={{ top: 24, right: 4, left: 4 }}>
          <XAxis
            dataKey="label"
            interval={0}
            tickLine={false}
            tickMargin={8}
            tickFormatter={formatTick}
            className="font-mono uppercase"
            fontSize={11}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(_value, _name, item) => {
                  const row = item.payload as BarChartRow;
                  return (
                    <span className="text-muted-foreground tabular-nums">
                      {row.display} {unit} · {row.share}%
                    </span>
                  );
                }}
              />
            }
          />
          <Bar dataKey="value" maxBarSize={64} minPointSize={1} activeBar={{ fill: "var(--color-value)" }}>
            {rows.map((row) => (
              <Cell key={row.label} fill={getBarFill(row, max)} />
            ))}
            <LabelList dataKey="display" position="top" offset={8} fontSize={12} className="fill-muted-foreground tabular-nums" />
          </Bar>
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
}
