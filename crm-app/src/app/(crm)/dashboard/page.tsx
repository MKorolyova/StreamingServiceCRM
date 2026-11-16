import type { Metadata } from "next";
import { subDays } from "date-fns";

import { formatCount, formatWatchTime } from "@/lib/format";
import { requireAuthContext } from "@/lib/auth/auth-context";

import { BracketLabel } from "../../components/landing-primitives";
import { CRM_SECTIONS } from "../components/crm-sections";
import { SectionCard } from "./components/section-card";
import { StatTile } from "./components/stat-tile";
import { countPaidPaymentsSince, getSubscriberTotals, sumMinutesWatchedSince } from "./queries";

export const metadata: Metadata = { title: "Overview · Streaming CRM" };

const RECENT_DAYS = 30;

export default async function DashboardPage() {
  const context = await requireAuthContext();
  const since = subDays(new Date(), RECENT_DAYS);

  // Each number is only loaded for viewers whose role may see that area.
  const [subscriberTotals, paidPayments, minutesWatched] = await Promise.all([
    context.hasPermission("subscribers.view") ? getSubscriberTotals() : null,
    context.hasPermission("payments.view") ? countPaidPaymentsSince(since) : null,
    context.hasPermission("activity.view") ? sumMinutesWatchedSince(since) : null,
  ]);

  const sections = CRM_SECTIONS.filter(
    (section) => section.key !== "overview" && (section.permission === null || context.hasPermission(section.permission)),
  );
  const firstName = context.user.name.split(" ")[0];
  const hasStats = subscriberTotals !== null || paidPayments !== null || minutesWatched !== null;

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div>
          <BracketLabel marker>Overview</BracketLabel>
          <h1 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
            Good to see you, {firstName}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Where the service stands right now, and a way into every part of the workspace your role
            can open.
          </p>
        </div>

        {hasStats && (
          <section aria-label="Key numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {subscriberTotals && (
              <>
                <StatTile
                  title="Active subscribers"
                  value={formatCount(subscriberTotals.active)}
                  note={`Of ${formatCount(subscriberTotals.total)} accounts in total`}
                />
                <StatTile
                  title="Profiles"
                  value={formatCount(subscriberTotals.profiles)}
                  note="Across all subscriber accounts"
                />
              </>
            )}
            {paidPayments !== null && (
              <StatTile
                title="Payments received"
                value={formatCount(paidPayments)}
                note={`Paid in the last ${RECENT_DAYS} days`}
              />
            )}
            {minutesWatched !== null && (
              <StatTile
                title="Time watched"
                value={formatWatchTime(minutesWatched)}
                note={`Across all profiles, last ${RECENT_DAYS} days`}
              />
            )}
          </section>
        )}

        <section aria-labelledby="sections-heading">
          <h2 id="sections-heading" className="text-xl font-medium tracking-tight">
            Workspace
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <li key={section.key}>
                <SectionCard section={section} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
