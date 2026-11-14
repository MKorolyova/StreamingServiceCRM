import { z } from "zod";
import { maturityLevelEnum, subscriberStatusEnum } from "@/db/schema";
import {
  countryCodeSchema,
  emailSchema,
  isoDateSchema,
  listQuerySchema,
  requireAtLeastOneField,
  uuidSchema,
} from "./common";

// ---------------------------------------------------------------------------
// Subscribers
// ---------------------------------------------------------------------------

export const subscriberStatusSchema = z.enum(subscriberStatusEnum.enumValues, "Invalid status");

export const subscriberKeySchema = z.object({ subscriberId: uuidSchema });

export const createSubscriberSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: emailSchema,
  status: subscriberStatusSchema.optional(),
  countryCode: countryCodeSchema,
});

export const updateSubscriberSchema = requireAtLeastOneField(createSubscriberSchema.partial());

export const listSubscribersQuerySchema = listQuerySchema([
  "name",
  "email",
  "createdAt",
  "status",
]).extend({
  status: subscriberStatusSchema.optional(),
  countryCode: countryCodeSchema.optional(),
});

// ---------------------------------------------------------------------------
// Profiles (weak entity of subscriber)
// ---------------------------------------------------------------------------

const profileNameSchema = z
  .string()
  .trim()
  .min(1, "Profile name is required")
  .max(50, "Profile name is too long");

export const profileKeySchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
});

export const createProfileSchema = z.object({
  subscriberId: uuidSchema,
  profileName: profileNameSchema,
  maturityLevel: z.enum(maturityLevelEnum.enumValues, "Invalid maturity level").optional(),
  // BCP 47 subset: "en", "pt-BR", "zh-Hant".
  language: z
    .string()
    .trim()
    .max(10, "Language is too long")
    .regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,4})?$/, "Must be a language tag such as `en` or `pt-BR`")
    .optional(),
  isDefault: z.boolean("Default must be true or false").optional(),
});

// profileName is part of the PK but FKs cascade on update, so renaming is allowed.
export const updateProfileSchema = requireAtLeastOneField(
  createProfileSchema.omit({ subscriberId: true }).partial(),
);

// ---------------------------------------------------------------------------
// Subscriptions (subscriber <-> plan)
// ---------------------------------------------------------------------------

const cancelReasonSchema = z.string().trim().max(500, "Cancel reason is too long");

export const subscriptionKeySchema = z.object({
  subscriberId: uuidSchema,
  planId: uuidSchema,
  startDate: isoDateSchema,
});

export const createSubscriptionSchema = subscriptionKeySchema
  .extend({
    endDate: isoDateSchema.nullable().optional(),
    cancelReason: cancelReasonSchema.nullable().optional(),
  })
  .refine((subscription) => !subscription.endDate || subscription.endDate >= subscription.startDate, { message: "End date must be on or after the start date", path: ["endDate"] })
  .refine((subscription) => !subscription.cancelReason || !!subscription.endDate, { message: "A cancel reason requires an end date", path: ["cancelReason"] });

export const updateSubscriptionSchema = requireAtLeastOneField(
  z.object({
    endDate: isoDateSchema.nullable().optional(),
    cancelReason: cancelReasonSchema.nullable().optional(),
  }),
)
  .refine((subscription) => !subscription.cancelReason || !!subscription.endDate, { message: "A cancel reason requires an end date", path: ["cancelReason"] });

export const cancelSubscriptionSchema = subscriptionKeySchema
  .extend({
    endDate: isoDateSchema,
    cancelReason: cancelReasonSchema.optional(),
  })
  .refine((subscription) => subscription.endDate >= subscription.startDate, { message: "End date must be on or after the start date", path: ["endDate"] });
