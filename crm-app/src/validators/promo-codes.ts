import { z } from "zod";
import { isoDateSchema, listQuerySchema, requireAtLeastOneField, uuidSchema } from "./common";

export const promoCodeValueSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(3, "Code must be at least 3 characters")
  .max(50, "Code is too long")
  .regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, digits, `-` and `_`");

// ---------------------------------------------------------------------------
// Promo codes
// ---------------------------------------------------------------------------

export const promoCodeKeySchema = z.object({ code: promoCodeValueSchema });

export const createPromoCodeSchema = z.object({
  code: promoCodeValueSchema,
  discountPercent: z.number("Discount must be a number").int("Discount must be a whole number").min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  maxUses: z.number("Max uses must be a number").int("Max uses must be a whole number").min(1, "Must allow at least 1 use").max(2_147_483_647, "Max uses is too large"),
  expiryDate: isoDateSchema,
});

// code is the PK but redemptions cascade on update, so renaming is allowed.
export const updatePromoCodeSchema = requireAtLeastOneField(createPromoCodeSchema.partial());

export const listPromoCodesQuerySchema = listQuerySchema([
  "code",
  "discountPercent",
  "maxUses",
  "expiryDate",
]).extend({
  expired: z.stringbool().optional(),
});

// ---------------------------------------------------------------------------
// Redemptions (subscriber <-> promo code, attributed to a campaign)
// ---------------------------------------------------------------------------

export const promoCodeRedemptionKeySchema = z.object({
  subscriberId: uuidSchema,
  code: promoCodeValueSchema,
});

export const redeemPromoCodeSchema = promoCodeRedemptionKeySchema.extend({
  campaignId: uuidSchema,
  redeemedDate: isoDateSchema.optional(),
});

export const listPromoCodeRedemptionsQuerySchema = listQuerySchema(["redeemedDate", "code"]).extend({
  code: promoCodeValueSchema.optional(),
  subscriberId: uuidSchema.optional(),
  campaignId: uuidSchema.optional(),
});
