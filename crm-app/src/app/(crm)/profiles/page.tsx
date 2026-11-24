import type { Metadata } from "next";
import { UserRound } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { MATURITY_LABELS } from "@/constants/constants";
import { maturityLevelEnum } from "@/db/schema";
import { requireAuthContext } from "@/lib/auth/auth-context";
import { formatCount, formatPercent } from "@/lib/format";

import { BarChart } from "../../../components/bar-chart";
import { ChartCard } from "../../../components/chart-card";
import { DataTable } from "../../../components/data-table";
import { PageHeader, SectionHeading } from "../../components/page-header";
import { StatTile } from "../../components/stat-tile";
import { listProfileUsageByPlan, listProfilesByLanguage, listProfilesByMaturityLevel } from "./queries";

export const metadata: Metadata = { title: "Profiles · Streaming CRM" };

const languageNames = new Intl.DisplayNames("en", { type: "language" });

function formatLanguage(tag: string): string {
  try {
    return languageNames.of(tag) ?? tag;
  } catch {
    return tag;
  }
}

export default async function ProfilesPage() {
  const context = await requireAuthContext();
  context.requirePermission("subscribers.view");

  const [maturityCounts, languages, planUsage] = await Promise.all([
    listProfilesByMaturityLevel(),
    listProfilesByLanguage(),
    listProfileUsageByPlan(),
  ]);

  const totalProfiles = maturityCounts.reduce((sum, entry) => sum + entry.profiles, 0);
  // Show every maturity level in age order, including the ones no profile uses.
  const profilesByMaturity = new Map(maturityCounts.map((entry) => [entry.maturityLevel, entry.profiles]));
  const planSubscribers = planUsage.reduce((sum, plan) => sum + plan.subscribers, 0);
  const planProfiles = planUsage.reduce((sum, plan) => sum + plan.profiles, 0);
  const allowedProfiles = planUsage.reduce((sum, plan) => sum + plan.subscribers * plan.maxProfiles, 0);

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PageHeader
          label="Profiles"
          title="Who is behind each account"
          description="Maturity levels and languages across all profiles, and whether subscribers use the profiles their plan pays for."
        />

        {totalProfiles === 0 ? (
          <EmptyState
            icon={UserRound}
            title="No profiles yet"
            description="This page fills in as soon as subscribers create their first profiles."
          />
        ) : (
          <>
            <section aria-label="Key numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile title="Profiles" value={formatCount(totalProfiles)} note="Across all subscriber accounts" />
              <StatTile
                title="Profiles per account"
                value={planSubscribers === 0 ? "—" : (planProfiles / planSubscribers).toFixed(1)}
                note="Average for subscribers with a running plan"
              />
              <StatTile
                title="Room used"
                value={formatPercent(allowedProfiles === 0 ? null : planProfiles / allowedProfiles, 0)}
                note={`${formatCount(planProfiles)} of ${formatCount(allowedProfiles)} profiles the plans allow`}
              />
              <StatTile title="Languages" value={formatCount(languages.length)} note="Different profile languages in use" />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <ChartCard title="Maturity levels" description="Profiles by the highest age rating they may watch.">
                <BarChart
                  unit="profiles"
                  entries={maturityLevelEnum.enumValues.map((level) => ({
                    label: MATURITY_LABELS[level],
                    value: profilesByMaturity.get(level) ?? 0,
                  }))}
                />
              </ChartCard>
              <ChartCard title="Languages" description="Profiles by their interface language.">
                <BarChart
                  unit="profiles"
                  entries={languages.map((entry) => ({ label: formatLanguage(entry.language), value: entry.profiles }))}
                />
              </ChartCard>
            </section>

            <section aria-labelledby="plan-usage-heading" className="flex flex-col gap-4">
              <SectionHeading
                id="plan-usage-heading"
                title="Are people using the room they pay for?"
                description="Average profiles per account on each plan, against the number the plan allows."
              />
              <DataTable
                caption="Profiles used per plan against the plan's maximum"
                columns={[
                  { label: "Plan" },
                  { label: "Subscribers", align: "right" },
                  { label: "Average of allowed" },
                  { label: "At the limit", align: "right" },
                  { label: "Using one profile", align: "right" },
                ]}
                rows={planUsage.map((plan) => {
                  const average = plan.subscribers === 0 ? 0 : plan.profiles / plan.subscribers;

                  return {
                    key: plan.planName,
                    cells: [
                      <span key="plan" className="font-medium">
                        {plan.planName}
                      </span>,
                      formatCount(plan.subscribers),
                      plan.subscribers === 0 ? (
                        <span key="usage" className="text-muted-foreground">
                          Nobody on this plan
                        </span>
                      ) : (
                        <Progress key="usage" value={average} max={plan.maxProfiles} className="min-w-48 gap-1.5">
                          <ProgressLabel className="text-xs font-normal tabular-nums">
                            {average.toFixed(1)} of {plan.maxProfiles} profiles
                          </ProgressLabel>
                          <ProgressValue className="text-xs" />
                        </Progress>
                      ),
                      plan.subscribers === 0
                        ? "—"
                        : `${formatCount(plan.subscribersAtLimit)} (${formatPercent(plan.subscribersAtLimit / plan.subscribers, 0)})`,
                      plan.maxProfiles <= 1 || plan.subscribers === 0
                        ? "—"
                        : `${formatCount(plan.subscribersWithOneProfile)} (${formatPercent(plan.subscribersWithOneProfile / plan.subscribers, 0)})`,
                    ],
                  };
                })}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
