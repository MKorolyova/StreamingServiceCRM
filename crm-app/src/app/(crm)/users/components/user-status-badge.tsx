import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { formatEnumLabel } from "@/lib/format";
import type { User } from "@/types/users";

const STATUS_CLASS_NAME: Record<User["status"], string> = {
  APPROVED: "bg-primary text-primary-foreground",
  PENDING: "border-dashed border-border bg-transparent text-foreground",
};

export function UserStatusBadge({ status }: { status: User["status"] }) {
  return (
    <Badge className={cn("px-2.5 font-mono text-[0.7rem] font-normal tracking-wider uppercase", STATUS_CLASS_NAME[status])}>
      {formatEnumLabel(status)}
    </Badge>
  );
}
