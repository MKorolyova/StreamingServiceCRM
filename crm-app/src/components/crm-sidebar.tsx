import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABELS } from "@/constants/constants";
import { getAuthContext } from "@/lib/auth/auth-context";

import { BracketLabel } from "../app/components/landing-primitives";
import { CrmNavLinks } from "./crm-nav-links";
import { CRM_SECTIONS } from "./crm-sections";

async function SidebarContent() {
  const context = await getAuthContext();
  if (!context) return null;

  const visibleKeys = CRM_SECTIONS.filter(
    (section) => section.permission === null || context.hasPermission(section.permission),
  ).map((section) => section.key);

  return (
    <>
      <CrmNavLinks visibleKeys={visibleKeys} />
      <div className="mt-auto hidden border-t border-dashed pt-4 lg:block">
        <p className="truncate font-medium">{context.user.name}</p>
        <p className="mt-1 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          {context.user.role ? ROLE_LABELS[context.user.role] : "No role"}
        </p>
      </div>
    </>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex gap-1 lg:flex-col" aria-busy="true" aria-label="Loading navigation">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-9 w-28 shrink-0 lg:w-full" />
      ))}
    </div>
  );
}

export function CrmSidebar() {
  return (
    <aside className="top-16 z-20 shrink-0 border-b border-dashed bg-background lg:sticky lg:h-[calc(100dvh-4rem)] lg:w-60 lg:border-r lg:border-b-0">
      <nav
        aria-label="Sections"
        className="flex h-full gap-3 overflow-x-auto px-5 py-3 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:px-4 lg:py-6"
      >
        <BracketLabel className="hidden px-3 lg:flex">Workspace</BracketLabel>
        <Suspense fallback={<SidebarSkeleton />}>
          <SidebarContent />
        </Suspense>
      </nav>
    </aside>
  );
}
