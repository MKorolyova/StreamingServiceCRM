import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { formatEnumLabel } from "@/lib/format";
import type { SubscriberStatus } from "@/types/subscribers";

const STATUS_CLASS_NAME = {
  ACTIVE: "bg-primary text-primary-foreground",
  PAUSED: "border-dashed border-border bg-transparent text-foreground",
  CANCELED: "bg-muted text-muted-foreground line-through",
};

export function SubscriberStatusBadge({ status }: { status: SubscriberStatus }) {
  return (
    <Badge className={cn("px-2.5 font-mono text-[0.7rem] font-normal tracking-wider uppercase", STATUS_CLASS_NAME[status])}>
      {formatEnumLabel(status)}
    </Badge>
  );
}
