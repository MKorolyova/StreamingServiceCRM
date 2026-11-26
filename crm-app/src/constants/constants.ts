import type { deviceTypeEnum, maturityLevelEnum, userRoleEnum } from "@/db/schema";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  SUPPORT_AGENT: "Support agent",
  BILLING: "Billing",
  MARKETING: "Marketing",
  CONTENT_MANAGER: "Content manager",
  ANALYST: "Analyst",
};

export type MaturityLevel = (typeof maturityLevelEnum.enumValues)[number];

export const MATURITY_LABELS: Record<MaturityLevel, string> = {
  ALL: "All ages",
  AGE_7: "7+",
  AGE_13: "13+",
  AGE_16: "16+",
  AGE_18: "18+",
};

export const DEVICE_TYPE_LABELS: Record<(typeof deviceTypeEnum.enumValues)[number], string> = {
  TV: "TV",
  PHONE: "Phone",
  TABLET: "Tablet",
  BROWSER: "Browser",
};

export const LIST_PRICE_CURRENCY = "USD";
export const NO_PLAN_FILTER = "none";
export const PROMO_EXPIRING_SOON_DAYS = 30;
export const PROMO_NEAR_LIMIT_RATIO = 0.8;
export const PROMO_RETENTION_WINDOW_DAYS = 30;
