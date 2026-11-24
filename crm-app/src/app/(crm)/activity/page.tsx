import type { Metadata } from "next";
import { subDays } from "date-fns";
import { Activity } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { DEVICE_TYPE_LABELS } from "@/constants/constants";
import { requireAuthContext } from "@/lib/auth/auth-context";
import { formatCount, formatPercent } from "@/lib/format";

import { BarList } from "../../../components/bar-list";
import { ChartCard } from "../../../components/chart-card";
import { DataTable } from "../../../components/data-table";
import { PageHeader } from "../../components/page-header";
import { StatTile } from "../../components/stat-tile";
import { WatchHeatmap } from "./components/watch-heatmap";
import {
  getActivityTotals,
  listCompletionByDeviceType,
  listPeakConcurrencyByPlan,
  listWatchTimeByWeekdayAndHour,
} from "./queries";

export const metadata: Metadata = { title: "Activity · Streaming CRM" };

const INACTIVE_DAYS = 30;

export default async function ActivityPage() {
  const context = await requireAuthContext();
  context.requirePermission("activity.view");

  const [totals, slots, completion, concurrency] = await Promise.all([
    getActivityTotals(subDays(new Date(), INACTIVE_DAYS)),
    listWatchTimeByWeekdayAndHour(),
    listCompletionByDeviceType(),
    listPeakConcurrencyByPlan(),
  ]);

  const completedSessions = completion.reduce((sum, entry) => sum + entry.completedSessions, 0);

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PageHeader
          label="Activity"
          title="How people watch"
          description="When viewing happens, what gets finished on each device, which profiles have gone quiet and how close plans run to their stream limits."
        />

        {totals.sessions === 0 ? (
          <EmptyState
            icon={Activity}
            title="Nothing watched yet"
            description="Activity fills in as soon as the first watch session is recorded."
          />
        ) : (
          <>
            <section aria-label="Key numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                title="Watch sessions"
                value={formatCount(totals.sessions)}
                note={`${formatPercent(completedSessions / totals.sessions, 0)} watched to the end`}
              />
              <StatTile
                title="Sessions per profile"
                value={(totals.sessions / Math.max(totals.profiles, 1)).toFixed(1)}
                note={`Average across all ${formatCount(totals.profiles)} profiles`}
              />
              <StatTile
                title={`Inactive ${INACTIVE_DAYS}+ days`}
                value={formatPercent(totals.profiles === 0 ? null : totals.inactiveProfiles / totals.profiles, 0)}
                note={`${formatCount(totals.inactiveProfiles)} profiles with nothing watched lately: an early churn warning`}
              />
              <StatTile
                title="Never watched"
                value={formatCount(totals.profiles - totals.watchingProfiles)}
                note="Profiles without a single session"
              />
            </section>

            <ChartCard
              title="Watch time by day and hour"
              description="Total time watched, placed by when each session started. Hours are in UTC."
            >
              <WatchHeatmap slots={slots} />
            </ChartCard>

            <section className="grid gap-4 lg:grid-cols-2">
              <ChartCard
                title="Completion rate by device type"
                description="Share of sessions on each kind of device that reached the end of the movie."
              >
                <BarList
                  max={1}
                  entries={completion.map((entry) => ({
                    label: DEVICE_TYPE_LABELS[entry.deviceType],
                    value: entry.completedSessions / entry.sessions,
                    display: formatPercent(entry.completedSessions / entry.sessions, 0),
                    note: `${formatCount(entry.completedSessions)} of ${formatCount(entry.sessions)} sessions`,
                  }))}
                />
              </ChartCard>

              <ChartCard
                title="Peak concurrent streams"
                description="The most streams a subscriber ran at once, against what their current plan allows."
              >
                <DataTable
                  caption="Peak concurrent streams per plan"
                  columns={[
                    { label: "Plan" },
                    { label: "Allowed", align: "right" },
                    { label: "Peak", align: "right" },
                    { label: "Avg peak", align: "right" },
                    { label: "Over limit" },
                  ]}
                  rows={concurrency.map((plan) => ({
                    key: plan.planName,
                    cells: [
                      <span key="plan" className="font-medium">
                        {plan.planName}
                      </span>,
                      plan.maxStreams,
                      plan.subscribers === 0 ? "—" : plan.peakStreams,
                      plan.subscribers === 0 ? "—" : plan.averagePeakStreams.toFixed(1),
                      plan.subscribersOverLimit > 0 ? (
                        <Badge key="over" variant="destructive" className="px-2.5 font-normal">
                          {formatCount(plan.subscribersOverLimit)} of {formatCount(plan.subscribers)} subscribers
                        </Badge>
                      ) : (
                        <span key="over" className="text-muted-foreground">
                          {plan.subscribers === 0 ? "No viewing yet" : "Nobody"}
                        </span>
                      ),
                    ],
                  }))}
                />
              </ChartCard>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
