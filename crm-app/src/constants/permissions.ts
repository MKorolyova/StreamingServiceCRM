import type { UserRole } from "@/constants/constants";

export const PERMISSIONS = [
  "subscribers.view",
  "subscribers.create",
  "subscribers.update",
  "subscribers.delete",
  "subscribers.manageProfiles",
  "subscribers.manageSubscription",
  "payments.view",
  "payments.record",
  "payments.refund",
  "plans.view",
  "plans.manage",
  "catalog.view",
  "catalog.manage",
  "devices.view",
  "devices.manage",
  "activity.view",
  "campaigns.view",
  "campaigns.manage",
  "campaigns.target",
  "promoCodes.view",
  "promoCodes.manage",
  "promoCodes.redeem",
  "reports.view",
  "users.view",
  "users.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const VIEW_PERMISSIONS = PERMISSIONS.filter(
  (permission) => permission.endsWith(".view") && permission !== "users.view",
);

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  ADMIN: PERMISSIONS,
  SUPPORT_AGENT: [
    "subscribers.view",
    "subscribers.create",
    "subscribers.update",
    "subscribers.manageProfiles",
    "subscribers.manageSubscription",
    "payments.view",
    "plans.view",
    "catalog.view",
    "devices.view",
    "activity.view",
    "campaigns.view",
    "promoCodes.view",
    "promoCodes.redeem",
  ],
  BILLING: [
    "subscribers.view",
    "subscribers.manageSubscription",
    "payments.view",
    "payments.record",
    "payments.refund",
    "plans.view",
    "plans.manage",
    "promoCodes.view",
    "reports.view",
  ],
  MARKETING: [
    "subscribers.view",
    "plans.view",
    "catalog.view",
    "activity.view",
    "campaigns.view",
    "campaigns.manage",
    "campaigns.target",
    "promoCodes.view",
    "promoCodes.manage",
    "reports.view",
  ],
  CONTENT_MANAGER: [
    "catalog.view",
    "catalog.manage",
    "devices.view",
    "devices.manage",
    "activity.view",
    "reports.view",
  ],
  ANALYST: VIEW_PERMISSIONS,
};

export function getRolePermissions(role: UserRole | null): ReadonlySet<Permission> {
  return new Set(role ? ROLE_PERMISSIONS[role] : []);
}
