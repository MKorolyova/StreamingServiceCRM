import Link from "next/link";

import { Button } from "@/components/ui/button";

export type SubscribersTab = "list" | "breakdown";

const TABS: { value: SubscribersTab; label: string; href: string }[] = [
  { value: "list", label: "All subscribers", href: "/subscribers" },
  { value: "breakdown", label: "Breakdown", href: "/subscribers?tab=breakdown" },
];

/** Tabs kept in the URL, so a view can be linked to and survives a refresh. */
export function SubscribersTabs({ activeTab }: { activeTab: SubscribersTab }) {
  return (
    <nav aria-label="Subscriber views" className="flex gap-1 border-b border-dashed">
      {TABS.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <Button
            key={tab.value}
            variant={isActive ? "default" : "ghost"}
            size="lg"
            className="h-10 px-4 font-mono text-xs font-normal tracking-[0.14em] uppercase"
            nativeButton={false}
            render={<Link href={tab.href} aria-current={isActive ? "page" : undefined} />}
          >
            {tab.label}
          </Button>
        );
      })}
    </nav>
  );
}
