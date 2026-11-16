import { forbidden } from "next/navigation";

import { getRolePermissions, type Permission } from "@/constants/permissions";
import { getCurrentUser } from "@/lib/auth/user-context";
import type { AuthContext } from "@/types/auth";
import type { User } from "@/types/users";

export function createAuthContext(user: User): AuthContext {
  const permissions = getRolePermissions(user.role);
  const hasPermission = (permission: Permission) => permissions.has(permission);
  const hasPermissions = (required: readonly Permission[]) => required.every(hasPermission);
  const requirePermission = (permission: Permission | readonly Permission[]) => {
    const required = typeof permission === "string" ? [permission] : permission;
    if (!hasPermissions(required)) forbidden();
  };

  return {
    user,
    permissions,
    hasPermission,
    hasPermissions,
    requirePermission,
  };
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.status !== "APPROVED" && user.role === null) return null;
  return createAuthContext(user);
}

export async function requireAuthContext(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) return forbidden();
  return context;
}
