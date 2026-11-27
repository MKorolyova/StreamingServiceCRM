"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const TABS: { label: string; href: string }[] = [
  { label: "All users", href: "/users" },
];

export function UsersTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="User views" className="flex gap-1 overflow-x-auto border-b border-dashed">
      {TABS.map((tab) => {
        const isActive = tab.href === pathname;

        return (
          <Button
            key={tab.href}
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
