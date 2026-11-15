import type { z } from "zod";
import type { promoCodeRedemptions, promoCodes } from "@/db/schema";
import type {
  createPromoCodeSchema,
  paginationPromoCodeRedemptionsSchema,
  paginationPromoCodesSchema,
  promoCodeKeySchema,
  promoCodeRedemptionKeySchema,
  redeemPromoCodeSchema,
  updatePromoCodeSchema,
} from "@/validators/promo-codes";

export type PromoCode = typeof promoCodes.$inferSelect;
export type PromoCodeKey = z.infer<typeof promoCodeKeySchema>;
export type CreatePromoCodeInput = z.infer<typeof createPromoCodeSchema>;
export type UpdatePromoCodeInput = z.infer<typeof updatePromoCodeSchema>;
export type ListPromoCodesQuery = z.infer<typeof paginationPromoCodesSchema>;

export type PromoCodeRedemption = typeof promoCodeRedemptions.$inferSelect;
export type PromoCodeRedemptionKey = z.infer<typeof promoCodeRedemptionKeySchema>;
export type RedeemPromoCodeInput = z.infer<typeof redeemPromoCodeSchema>;
export type ListPromoCodeRedemptionsQuery = z.infer<typeof paginationPromoCodeRedemptionsSchema>;
