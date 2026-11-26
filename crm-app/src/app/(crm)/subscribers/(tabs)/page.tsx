import type { Metadata } from "next";
import { requireAuthContext } from "@/lib/auth/auth-context";
import type { PageSearchParams } from "@/types/search-params";
import type { ListSubscribersQuery } from "@/types/subscribers";
import { paginationSubscribersSchema } from "@/validators/subscribers";
import { SubscribersListTab } from "../components/subscribers-all-subscribers-tab";

export const metadata: Metadata = { title: "Subscribers · Streaming CRM" };

export default async function SubscribersPage({ searchParams }: { searchParams: PageSearchParams }) {

  const context = await requireAuthContext();
  context.requirePermission("subscribers.view");
  const params: ListSubscribersQuery = paginationSubscribersSchema.parse(await searchParams);

  return (
    <div className="px-2 py-2">

        <SubscribersListTab
          page={params.page}
          pageSize={params.pageSize}
          query={params.query}
          sortDir={params.sortDir}
          sortBy={params.sortBy}
          status={params.status}
          countryCode={params.countryCode}
          plan={params.plan}
          from={params.from}
          to={params.to}
        />


    </div>
  );
}
