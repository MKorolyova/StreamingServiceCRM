import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEVICE_TYPE_LABELS, LIST_PRICE_CURRENCY, MATURITY_LABELS } from "@/constants/constants";
import { requireAuthContext } from "@/lib/auth/auth-context";
import { formatCount, formatDate, formatDateOnly, formatEnumLabel, formatMoney, formatWatchTime } from "@/lib/format";
import { uuidSchema } from "@/validators/common";

import { ChartCard } from "../../../../components/chart-card";
import { DataTable } from "../../../../components/data-table";
import { PageHeader } from "../../../components/page-header";
import { StatTile } from "../../../components/stat-tile";
import { SubscriberProfiles } from "../components/subscriber-profiles";
import { SubscriberStatusBadge } from "../components/subscriber-status-badge";
import { SubscriptionTimeline } from "./components/subscription-timeline";
import {
  getSubscriberById,
  listCampaignTouches,
  listDevicesUsed,
  listPromoRedemptions,
  listSubscriberProfiles,
  listSubscriptionHistory,
} from "./queries";

export const metadata: Metadata = { title: "Subscriber · Streaming CRM" };

export default async function SubscriberPage({ params }: { params: Promise<{ subscriberId: string }> }) {
  const context = await requireAuthContext();
  context.requirePermission("subscribers.view");

  const subscriberId = uuidSchema.safeParse((await params).subscriberId).data;
  if (!subscriberId) notFound();

  const [subscriber, history, profiles, campaignTouches, promoRedemptions, devicesUsed, payments] = await Promise.all([
    getSubscriberById(subscriberId),
    listSubscriptionHistory(subscriberId),
    listSubscriberProfiles(subscriberId),
    context.hasPermission("campaigns.view") ? listCampaignTouches(subscriberId) : null,
    context.hasPermission("promoCodes.view") ? listPromoRedemptions(subscriberId) : null,
    context.hasPermission("devices.view") ? listDevicesUsed(subscriberId) : null,
    context.hasPermission("payments.view") ? listSubscriberPayments(subscriberId) : null,
  ]);
  if (!subscriber) notFound();

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PageHeader
          label="Subscriber"
          title={subscriber.name}
          description={`${subscriber.email} · ${subscriber.countryName} · joined ${formatDate(subscriber.createdAt)}`}
        >
          <div className="mt-4">
            <SubscriberStatusBadge status={subscriber.status} />
          </div>
          <Button variant="outline" className="mt-6 border-dashed" nativeButton={false} render={<Link href="/subscribers" />}>
            <ArrowLeft data-icon="inline-start" aria-hidden />
            All subscribers
          </Button>
        </PageHeader>

        <section aria-label="Key numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            title="Current plan"
            value={subscriber.planName ?? "None"}
            note={
              subscriber.planPriceCents === null
                ? "No running subscription"
                : `${formatMoney(subscriber.planPriceCents, LIST_PRICE_CURRENCY)} per month at list price`
            }
          />
          <StatTile
            title="Plans held"
            value={formatCount(history.length)}
            note={history.length === 0 ? "Never subscribed" : `Since ${formatDateOnly(history[history.length - 1].startDate)}`}
          />
          <StatTile title="Profiles" value={formatCount(profiles.length)} note="Viewers on this account" />
          <StatTile title="Watch time" value={formatWatchTime(subscriber.minutesWatched)} note="Across all profiles" />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Subscription history"
            description="Every plan this subscriber has held, newest first, and why each one ended."
            isEmpty={history.length === 0}
            emptyDescription="This subscriber has never started a plan."
          >
            <SubscriptionTimeline entries={history} />
          </ChartCard>

          <ChartCard title="Profiles" description="The viewers on this account.">
            <SubscriberProfiles
              profiles={profiles.map((profile) => ({
                profileName: profile.profileName,
                maturityLabel: MATURITY_LABELS[profile.maturityLevel],
                language: profile.language,
                isDefault: profile.isDefault,
              }))}
            />
          </ChartCard>
        </section>

        {devicesUsed && (
          <ChartCard
            title="Devices used"
            description="Every device any profile of this account has watched on, most recently used first."
            isEmpty={devicesUsed.length === 0}
            emptyDescription="Nobody on this account has watched anything yet."
          >
            <DataTable
              caption="Devices used across all profiles"
              columns={[
                { label: "Device" },
                { label: "Type" },
                { label: "System" },
                { label: "Profiles" },
                { label: "Sessions", align: "right" },
                { label: "Watch time", align: "right" },
                { label: "Last used", align: "right" },
              ]}
              rows={devicesUsed.map((device) => ({
                key: device.deviceId,
                cells: [
                  <span key="model" className="font-medium">
                    {device.model}
                  </span>,
                  DEVICE_TYPE_LABELS[device.deviceType],
                  device.os,
                  device.profileNames.join(", "),
                  formatCount(device.sessions),
                  formatWatchTime(device.minutesWatched),
                  formatDate(device.lastWatchedAt),
                ],
              }))}
            />
          </ChartCard>
        )}

        {(campaignTouches || promoRedemptions) && (
          <section className="grid gap-4 lg:grid-cols-2">
            {campaignTouches && (
              <ChartCard
                title="Campaigns"
                description="Campaigns this subscriber was targeted by, and how they responded."
                isEmpty={campaignTouches.length === 0}
                emptyDescription="No campaign has targeted this subscriber."
              >
                <DataTable
                  caption="Campaigns the subscriber was targeted by"
                  columns={[{ label: "Campaign" }, { label: "Type" }, { label: "Sent" }, { label: "Response" }]}
                  rows={campaignTouches.map((touch) => ({
                    key: touch.campaignId,
                    cells: [
                      <span key="name" className="font-medium">
                        {touch.campaignName}
                      </span>,
                      formatEnumLabel(touch.campaignType),
                      formatDateOnly(touch.sentDate),
                      <Badge
                        key="response"
                        variant={touch.response === "REDEEMED" ? "default" : "outline"}
                        className="px-2.5 font-mono text-[0.7rem] font-normal tracking-wider uppercase"
                      >
                        {formatEnumLabel(touch.response)}
                      </Badge>,
                    ],
                  }))}
                />
              </ChartCard>
            )}

            {promoRedemptions && (
              <ChartCard
                title="Promo codes redeemed"
                description="Discount codes this subscriber has used, and the campaign each came from."
                isEmpty={promoRedemptions.length === 0}
                emptyDescription="This subscriber has not redeemed a promo code."
              >
                <DataTable
                  caption="Promo codes the subscriber redeemed"
                  columns={[{ label: "Code" }, { label: "Discount", align: "right" }, { label: "Campaign" }, { label: "Redeemed" }]}
                  rows={promoRedemptions.map((redemption) => ({
                    key: redemption.code,
                    cells: [
                      <span key="code" className="font-mono font-medium">
                        {redemption.code}
                      </span>,
                      `${redemption.discountPercent}%`,
                      redemption.campaignName,
                      formatDateOnly(redemption.redeemedDate),
                    ],
                  }))}
                />
              </ChartCard>
            )}
          </section>
        )}

        {payments && (
          <ChartCard title="Payments" description={`Every payment on this account, newest first, in ${subscriber.currencyCode}.`}>
            <SubscriberPayments
              payments={payments.map((payment) => ({
                paymentId: payment.paymentId,
                date: formatDate(payment.createdAt),
                amount: formatMoney(payment.amountCents, subscriber.currencyCode),
                method: payment.method,
                statusLabel: formatEnumLabel(payment.status),
                isPaid: payment.status === "PAID",
              }))}
            />
          </ChartCard>
        )}
      </div>
    </main>
  );
}
