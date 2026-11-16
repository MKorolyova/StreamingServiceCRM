import type { userRoleEnum } from "@/db/schema";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  SUPPORT_AGENT: "Support agent",
  BILLING: "Billing",
  MARKETING: "Marketing",
  CONTENT_MANAGER: "Content manager",
  ANALYST: "Analyst",
};
