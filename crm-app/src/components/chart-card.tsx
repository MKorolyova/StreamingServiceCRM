import type { ReactNode } from "react";
import { ChartNoAxesColumn } from "lucide-react";
import { cn } from "cn";

import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Corners } from "../app/components/landing-primitives";

type ChartCardProps = {
  title: string;
  description?: string;
  /** True when there is nothing behind the chart yet; shows an empty state instead of the children. */
  isEmpty?: boolean;
  emptyDescription?: string;
  className?: string;
  children: ReactNode;
};

/** Corner-marked card that frames one chart or table of a report. */
export function ChartCard({
  title,
  description,
  isEmpty = false,
  emptyDescription = "This fills in as soon as there is data behind it.",
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn("relative [--card-spacing:--spacing(6)]", className)}>
      <Corners />
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState icon={ChartNoAxesColumn} title="Nothing to show yet" description={emptyDescription} className="py-10" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
