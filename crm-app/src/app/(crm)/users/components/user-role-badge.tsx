import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, type UserRole } from "@/constants/constants";

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant="outline" className="px-2.5 font-normal">
      {ROLE_LABELS[role]}
    </Badge>
  );
}
