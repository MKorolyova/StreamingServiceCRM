"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { CRM_SECTIONS } from "./crm-sections";

export function CrmNavLinks({ visibleKeys }: { visibleKeys: string[] }) {
  const pathname = usePathname();
  const sections = CRM_SECTIONS.filter((section) => visibleKeys.includes(section.key));

  return (
    <ul className="flex gap-1 lg:flex-col">
      {sections.map((section) => {
        const isActive = pathname === section.href || pathname.startsWith(`${section.href}/`);

        if (!section.isAvailable) {
          return (
            <li key={section.key}>
              <span aria-disabled className={cn("flex h-9 shrink-0 items-center gap-2.5 px-3 text-[0.9rem] whitespace-nowrap", "text-muted-foreground/70")}>
                <section.icon aria-hidden className="size-4" strokeWidth={1.5} />
                {section.label}
                <span className="ml-auto border border-dashed px-1.5 py-px font-mono text-[0.6rem] tracking-wider uppercase">
                  Soon
                </span>
              </span>
            </li>
          );
        }

        return (
          <li key={section.key}>
            <Link
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2.5 px-3 text-[0.9rem] whitespace-nowrap",
                "outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <section.icon aria-hidden className="size-4" strokeWidth={1.5} />
              {section.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
