import type { Metadata } from "next";
import { requireAuthContext } from "@/lib/auth/auth-context";
import type { ListPaymentsQuery } from "@/types/payments";
import type { PageSearchParams } from "@/types/search-params";
import { paginationPaymentsSchema } from "@/validators/payments";
import { PaymentsListTab } from "../components/payments-all-payments-tab";

export const metadata: Metadata = { title: "Payments · Streaming CRM" };

export default async function PaymentsPage({ searchParams }: { searchParams: PageSearchParams }) {

  const context = await requireAuthContext();
  context.requirePermission("payments.view");
  const params: ListPaymentsQuery = paginationPaymentsSchema.safeParse(await searchParams).data ?? paginationPaymentsSchema.parse({});

  return (
    <div className="px-2 py-2">
        <PaymentsListTab params={params} canViewSubscribers={context.hasPermission("subscribers.view")} />
    </div>
  );
}
