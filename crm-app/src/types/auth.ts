import type { Permission } from "@/constants/permissions";
import type { User } from "@/types/users";

export type AuthContext = {
  user: User;
  permissions: ReadonlySet<Permission>;
  hasPermission: (permission: Permission) => boolean;
  hasPermissions: (permissions: readonly Permission[]) => boolean;
  requirePermission: (permission: Permission | readonly Permission[]) => void;
};
