import { PROMO_EXPIRING_SOON_DAYS, PROMO_NEAR_LIMIT_RATIO } from "@/constants/constants";

import type { PromoCodeListEntry } from "./queries";

export type PromoCodeFlag = "Expired" | "Used up" | "Expiring soon" | "Close to limit";

export function getPromoCodeFlags(code: PromoCodeListEntry): PromoCodeFlag[] {
  const flags: PromoCodeFlag[] = [];
  if (code.daysUntilExpiry < 0) flags.push("Expired");
  if (code.daysUntilExpiry <= PROMO_EXPIRING_SOON_DAYS) flags.push("Expiring soon");
  if (code.uses >= code.maxUses) flags.push("Used up");
  if (code.uses >= code.maxUses * PROMO_NEAR_LIMIT_RATIO) flags.push("Close to limit");
  return flags;
}

export function needsAttention(code: PromoCodeListEntry): boolean {
  const flags = getPromoCodeFlags(code);
  return flags.includes("Expiring soon") || flags.includes("Close to limit");
}
