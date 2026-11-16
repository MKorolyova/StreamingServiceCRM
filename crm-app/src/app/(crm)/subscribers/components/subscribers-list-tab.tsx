import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { formatDate, formatEnumLabel, formatMoney, formatWatchTime } from "@/lib/format";
import type { Payment } from "@/types/payments";
import type { Profile } from "@/types/subscribers";

import { listPaymentsBySubscriber, listSubscribers } from "../queries";
import type { SubscriberPaymentRow } from "./subscriber-payments";
import type { SubscriberProfileRow } from "./subscriber-profiles-popover";
import { SubscribersPagination } from "./subscribers-pagination";
import { SubscribersTable, type SubscriberRow } from "./subscribers-table";

const MATURITY_LABELS: Record<Profile["maturityLevel"], string> = {
  ALL: "All ages",
  AGE_7: "7+",
  AGE_13: "13+",
  AGE_16: "16+",
  AGE_18: "18+",
};

function toProfileRow(profile: Profile): SubscriberProfileRow {
  return {
    profileName: profile.profileName,
    maturityLabel: MATURITY_LABELS[profile.maturityLevel],
    language: profile.language,
    isDefault: profile.isDefault,
  };
}

function toPaymentRow(payment: Payment, currencyCode: string): SubscriberPaymentRow {
  return {
    paymentId: payment.paymentId,
    date: formatDate(payment.createdAt),
    amount: formatMoney(payment.amountCents, currencyCode),
    method: payment.method,
    statusLabel: formatEnumLabel(payment.status),
    isPaid: payment.status === "PAID",
  };
}

type SubscribersListTabProps = {
  page: number;
  pageSize: number;
  /** Payments are only loaded for viewers who may see them. */
  canViewPayments: boolean;
};

export async function SubscribersListTab({ page, pageSize, canViewPayments }: SubscribersListTabProps) {
  const { entries, total } = await listSubscribers(page, pageSize);

  if (total === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No subscribers yet"
        description="Subscribers appear here as soon as the first account is created."
      />
    );
  }

  // A page past the end, for example from an old link: go to the last real page.
  if (entries.length === 0) redirect(`/subscribers?page=${Math.ceil(total / pageSize)}`);

  const paymentsBySubscriber = canViewPayments
    ? await listPaymentsBySubscriber(entries.map((entry) => entry.subscriberId))
    : null;

  const rows: SubscriberRow[] = entries.map((entry) => ({
    subscriberId: entry.subscriberId,
    name: entry.name,
    email: entry.email,
    createdDate: formatDate(entry.createdAt),
    status: entry.status,
    profiles: entry.profiles.map(toProfileRow),
    watchTime: formatWatchTime(entry.minutesWatched),
    payments:
      paymentsBySubscriber &&
      (paymentsBySubscriber.get(entry.subscriberId) ?? []).map((payment) => toPaymentRow(payment, entry.currencyCode)),
  }));

  return (
    <div className="flex flex-col gap-4">
      <SubscribersTable rows={rows} showPayments={canViewPayments} />
      <SubscribersPagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
