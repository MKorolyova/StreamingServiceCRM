import type { ReactNode } from "react";

import { getAuthContext } from "@/lib/auth/context";
import type { Permission } from "@/lib/auth/permissions";

type RestrictedProps = {
  /** All listed permissions are required. */
  permission: Permission | readonly Permission[];
  children: ReactNode;
  /** Shown when access is missing. Defaults to rendering nothing. */
  fallback?: ReactNode;
};

/** Server component that only renders its children for permitted users. */
export async function Restricted({ permission, children, fallback = null }: RestrictedProps) {
  const context = await getAuthContext();
  const required = typeof permission === "string" ? [permission] : permission;

  if (!context?.hasPermissions(required)) return fallback;
  return children;
}
