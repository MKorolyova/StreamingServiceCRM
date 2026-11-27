import { Suspense, type ReactNode } from "react";

import { requireAuthContext } from "@/lib/auth/auth-context";

import { ContentSkeleton } from "../../../../components/content-skeleton";
import { PageHeader } from "../../../components/page-header";
import { UsersTabs } from "../components/users-tabs";

/**
 * Only admins hold users.view; everyone else gets the forbidden page, not just a hidden link.
 * The check runs inside Suspense so the layout itself never waits on it: the header and tabs
 * render straight away, and no loading.tsx is needed above this layout.
 */
async function RequireUsersAccess({ children }: { children: ReactNode }) {
  const context = await requireAuthContext();
  context.requirePermission("users.view");
  return children;
}

export default function UsersLayout({ children }: LayoutProps<"/users">) {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          label="Users"
          title="Who has access"
          description="Staff accounts with their role and approval status. Only admins can see this page."
        />

        <UsersTabs />

        <Suspense
          fallback={
            <div aria-busy="true" aria-label="Loading users" className="flex flex-col gap-8">
              <ContentSkeleton rows={8} />
            </div>
          }
        >
          <RequireUsersAccess>{children}</RequireUsersAccess>
        </Suspense>
      </div>
    </main>
  );
}
