import type { Metadata } from "next";

import { requireAuthContext } from "@/lib/auth/auth-context";
import { paginationSchema } from "@/validators/common";

import { BracketLabel } from "../../components/landing-primitives";
import { SubscriberBreakdownTab } from "./components/subscriber-breakdown-tab";
import { SubscribersListTab } from "./components/subscribers-list-tab";
import { SubscribersTabs, type SubscribersTab } from "./components/subscribers-tabs";

export const metadata: Metadata = { title: "Subscribers · Streaming CRM" };

const pageQuerySchema = paginationSchema.pick({ page: true, pageSize: true });

type SubscribersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SubscribersPage({ searchParams }: SubscribersPageProps) {
  const context = await requireAuthContext();
  context.requirePermission("subscribers.view");

  const params = await searchParams;
  const activeTab: SubscribersTab = params.tab === "breakdown" ? "breakdown" : "list";
  // A malformed page number in the URL falls back to the first page.
  const { page, pageSize } = pageQuerySchema.safeParse(params).data ?? pageQuerySchema.parse({});

  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <BracketLabel marker>Subscribers</BracketLabel>
          <h1 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl">
            Everyone who watches
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Accounts with their profiles, viewing and payments, and how they split across countries,
            plans, devices and status.
          </p>
        </div>

        <SubscribersTabs activeTab={activeTab} />

        {activeTab === "list" ? (
          <SubscribersListTab
            page={page}
            pageSize={pageSize}
            canViewPayments={context.hasPermission("payments.view")}
          />
        ) : (
          <SubscriberBreakdownTab />
        )}
      </div>
    </main>
  );
}
