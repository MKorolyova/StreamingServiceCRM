import Link from "next/link";
import { cn } from "cn";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { BracketLabel, Corners } from "../../../components/landing-primitives";
import type { CrmSection } from "../../components/crm-sections";

/** Card that opens a dashboard section, or marks it as coming soon. */
export function SectionCard({ section }: { section: CrmSection }) {
  const card = (
    <Card
      className={cn(
        "relative h-full gap-3 text-base transition-colors [--card-spacing:--spacing(6)]",
        section.isAvailable ? "group-hover:bg-muted" : "bg-transparent text-muted-foreground",
      )}
    >
      {section.isAvailable && <Corners />}
      <CardHeader>
        <CardDescription>
          <BracketLabel marker={section.isAvailable}>{section.isAvailable ? "Open" : "Soon"}</BracketLabel>
        </CardDescription>
        <CardAction>
          <section.icon aria-hidden className="size-5 text-muted-foreground" strokeWidth={1.5} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg tracking-tight">{section.label}</CardTitle>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{section.description}</p>
      </CardContent>
    </Card>
  );

  if (!section.isAvailable) return card;

  return (
    <Link href={section.href} className="group block h-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      {card}
    </Link>
  );
}
