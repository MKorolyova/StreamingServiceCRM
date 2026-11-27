import type { Metadata } from "next";

import { requireAuthContext } from "@/lib/auth/auth-context";
import type { PageSearchParams } from "@/types/search-params";

import { SectionHeading } from "../../../components/page-header";
import { UsersListTab } from "../components/users-all-users-tab";
import { listUsersPageSchema } from "../validators";

export const metadata: Metadata = { title: "Users · Streaming CRM" };

export default async function UsersPage({ searchParams }: { searchParams: PageSearchParams }) {
  // Checked here too: the page loads the data, and a layout check alone does not guard it.
  const context = await requireAuthContext();
  context.requirePermission("users.view");
  const params = listUsersPageSchema.parse(await searchParams);
  const canManage = context.hasPermission("users.manage");

  return (
    <section aria-labelledby="users-list-heading" className="flex flex-col gap-6">
      <SectionHeading
        id="users-list-heading"
        title="Everyone with an account"
        description="Every staff member who has signed in, approved or not."
      />
      <UsersListTab {...params} currentUserId={context.user.userId} canManage={canManage} />
    </section>
  );
}
