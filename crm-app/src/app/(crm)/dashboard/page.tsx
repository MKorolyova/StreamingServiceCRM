import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { subDays } from "date-fns";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LIST_PRICE_CURRENCY } from "@/constants/constants";
import { requireAuthContext } from "@/lib/auth/auth-context";
import { formatCount, formatMoney, formatWatchTime } from "@/lib/format";

import { BarList } from "../../components/bar-list";
import { ChartCard } from "../../components/chart-card";
import { PageHeader } from "../../components/page-header";
import { StatTile } from "../../components/stat-tile";
import {
  getMonthlyRecurringRevenue,
  getPaymentTotalsSince,
  getSubscriberTotals,
  listRecentFailedPaymentsOfActiveSubscribers,
  listTopMoviesSince,
  sumMinutesWatchedSince,
} from "./queries";

export const metadata: Metadata = { title: "Overview · Streaming CRM" };

const RECENT_DAYS = 30;
const WEEK_DAYS = 7;

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button variant="outline" className="mt-4 border-dashed" nativeButton={false} render={<Link href={href} />}>
      {children}
      <ArrowRight data-icon="inline-end" aria-hidden />
    </Button>
  );
}

export default async function DashboardPage() {
  const context = await requireAuthContext();
  const now = new Date();
  const recentSince = subDays(now, RECENT_DAYS);
  const weekSince = subDays(now, WEEK_DAYS);

  const canViewSubscribers = context.hasPermission("subscribers.view");
  const canViewPayments = context.hasPermission("payments.view");
  const canViewActivity = context.hasPermission("activity.view");
  const canViewCatalog = context.hasPermission("catalog.view");

  const [subscriberTotals, recurringRevenue, paymentTotals, failedPayments, minutesWatched, topMovies] =
    await Promise.all([
      canViewSubscribers ? getSubscriberTotals(recentSince) : null,
      canViewPayments ? getMonthlyRecurringRevenue() : null,
      canViewPayments ? getPaymentTotalsSince(recentSince) : null,
      canViewPayments ? listRecentFailedPaymentsOfActiveSubscribers(5) : null,
      canViewActivity ? sumMinutesWatchedSince(weekSince) : null,
      canViewCatalog && canViewActivity ? listTopMoviesSince(recentSince, 5) : null,
    ]);

  const firstName = context.user.name.split(" ")[0];

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PageHeader
          label="Overview"
          title={`Good to see you, ${firstName}`}
          description="Where the service stands right now."
        />

        {subscriberTotals && (
          <section aria-label="Subscribers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              title="Active subscribers"
              value={formatCount(subscriberTotals.active)}
              note={`Of ${formatCount(subscriberTotals.total)} accounts in total`}
            />
            <StatTile title="Paused" value={formatCount(subscriberTotals.paused)} note="Accounts on hold, not billed" />
            <StatTile title="Canceled" value={formatCount(subscriberTotals.canceled)} note="Accounts that have left" />
            <StatTile
              title="New signups"
              value={formatCount(subscriberTotals.newSignups)}
              note={`Accounts created in the last ${RECENT_DAYS} days`}
            />
          </section>
        )}

        {recurringRevenue && paymentTotals && (
          <section aria-label="Billing" className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                title="Monthly recurring revenue"
                value={formatMoney(recurringRevenue.monthlyCents, LIST_PRICE_CURRENCY)}
                note={`${formatCount(recurringRevenue.subscriptions)} running subscriptions, at list price`}
              />
              <StatTile
                title="Payments received"
                value={formatCount(paymentTotals.paid)}
                note={`Paid in the last ${RECENT_DAYS} days`}
              />
              <StatTile
                title="Failed payments"
                value={formatCount(paymentTotals.failed)}
                note={`Failed in the last ${RECENT_DAYS} days`}
              />
              <StatTile
                title="Refunds"
                value={formatCount(paymentTotals.refunded)}
                note={`Refunded in the last ${RECENT_DAYS} days`}
              />
            </div>
          </section>
        )}

        {topMovies && (
          <section aria-label="Viewing" className="grid gap-4 lg:grid-cols-4">
            <ChartCard
              title="Top movies"
              description={`Most watched in the last ${RECENT_DAYS} days, by time watched.`}
              isEmpty={topMovies.length === 0}
              emptyDescription={`Nothing has been watched in the last ${RECENT_DAYS} days.`}
              className="lg:col-span-4"
            >
              <BarList
                entries={topMovies.map((movie) => ({
                  label: movie.title,
                  value: movie.minutesWatched,
                  display: formatWatchTime(movie.minutesWatched),
                  note: `${formatCount(movie.sessions)} ${movie.sessions === 1 ? "session" : "sessions"}`,
                }))}
              />
              <LinkButton href="/movies">Open the catalog</LinkButton>
            </ChartCard>
          </section>
        )}
      </div>
    </main>
  );
}
