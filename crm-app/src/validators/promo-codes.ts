import { z } from "zod";
import { 
  isoDateSchema,
  uuidSchema,
  paginationSchema,
} from "./common";

// ---------------------------------------------------------------------------
// Promo codes
// ---------------------------------------------------------------------------

export const promoCodeKeySchema = z.object({ 
  code: z.string().trim().toUpperCase().min(3, "Code must be at least 3 characters").max(50, "Code is too long").regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, digits, `-` and `_`") 
});

export const createPromoCodeSchema = z.object({
  code: z.string().trim().toUpperCase().min(3, "Code must be at least 3 characters").max(50, "Code is too long").regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, digits, `-` and `_`"),
  discountPercent: z.number("Discount must be a number").int("Discount must be a whole number").min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  maxUses: z.number("Max uses must be a number").int("Max uses must be a whole number").min(1, "Must allow at least 1 use").max(2_147_483_647, "Max uses is too large"),
  expiryDate: isoDateSchema,
});

export const updatePromoCodeSchema = createPromoCodeSchema
  .partial();

export const paginationPromoCodesSchema = paginationSchema.extend({
  sortBy: z.enum(["code", "discount", "uses", "expiry", "givenAway"]).default("expiry"),
});

// ---------------------------------------------------------------------------
// Redemptions (subscriber <-> promo code, attributed to a campaign)
// ---------------------------------------------------------------------------

export const promoCodeRedemptionKeySchema = z.object({
  subscriberId: uuidSchema,
  code: z.string().trim().toUpperCase().min(3, "Code must be at least 3 characters").max(50, "Code is too long").regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, digits, `-` and `_`"),
});

export const redeemPromoCodeSchema = promoCodeRedemptionKeySchema.extend({
  subscriberId: uuidSchema, 
  code: z.string().trim().toUpperCase().min(3, "Code must be at least 3 characters").max(50, "Code is too long").regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, digits, `-` and `_`"),
  campaignId: uuidSchema,
  redeemedDate: isoDateSchema.optional(),
});

export const paginationPromoCodeRedemptionsSchema = paginationSchema.extend({
  code: z.string().trim().toUpperCase().min(3, "Code must be at least 3 characters").max(50, "Code is too long").regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, digits, `-` and `_`").optional(),
  campaignId: uuidSchema.optional(),
});
