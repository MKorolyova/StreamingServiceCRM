import type { Metadata } from "next";
import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { requireAuthContext } from "@/lib/auth/auth-context";

import { RevenueGraphs } from "../../components/revenue-graphs";
import { getPaymentCount } from "../../queries";

export const metadata: Metadata = { title: "Payment stats · Streaming CRM" };

export default async function PaymentStatsPage() {
  
  const context = await requireAuthContext();
  context.requirePermission("payments.view");

  const paymentCount = await getPaymentCount();

  if (paymentCount === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Payments appear here as soon as the first one is recorded."
      />
    );
  }

  return <RevenueGraphs />;
}
