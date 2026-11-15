import { z } from "zod";
import { maturityLevelEnum, subscriberStatusEnum } from "@/db/schema";
import {
  countryCodeSchema,
  emailSchema,
  isoDateSchema,
  paginationSchema,
  uuidSchema,
} from "./common";

// ---------------------------------------------------------------------------
// Subscribers
// ---------------------------------------------------------------------------

export const subscriberStatusSchema = z.enum(subscriberStatusEnum.enumValues, "Invalid status");

export const subscriberKeySchema = z.object({
  subscriberId: uuidSchema,
});

export const createSubscriberSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: emailSchema,
  status: subscriberStatusSchema.optional(),
  countryCode: countryCodeSchema,
});

export const updateSubscriberSchema = createSubscriberSchema
  .partial();

export const paginationSubscribersSchema = paginationSchema.extend({
  status: subscriberStatusSchema.optional(),
  countryCode: countryCodeSchema.optional(),
});

// ---------------------------------------------------------------------------
// Profiles (weak entity of subscriber)
// ---------------------------------------------------------------------------

export const profileKeySchema = z.object({
  subscriberId: uuidSchema,
  profileName: z.string().trim().min(1, "Profile name is required").max(50, "Profile name is too long"),
});

export const createProfileSchema = z.object({
  subscriberId: uuidSchema,
  profileName: z.string().trim().min(1, "Profile name is required").max(50, "Profile name is too long"),
  maturityLevel: z.enum(maturityLevelEnum.enumValues, "Invalid maturity level").default("AGE_18"),
  language: z.string().trim().max(10, "Language is too long").regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,4})?$/, "Must be a language tag such as `en` or `pt-BR`").default("en"),
  isDefault: z.boolean("Default must be true or false").default(false),
});

export const updateProfileSchema = createProfileSchema
  .omit({ subscriberId: true })
  .partial();

// ---------------------------------------------------------------------------
// Subscriptions (subscriber <-> plan)
// ---------------------------------------------------------------------------

export const subscriptionKeySchema = z.object({
  subscriberId: uuidSchema,
  planId: uuidSchema,
  startDate: isoDateSchema,
});

// Kept unrefined so update can derive from it; .omit() / .partial() can't follow .refine().
const subscriptionFieldsSchema = z.object({
  subscriberId: uuidSchema,
  planId: uuidSchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema.nullable().optional(),
  cancelReason: z.string().trim().max(500, "Cancel reason is too long").nullable().optional(),
});

export const createSubscriptionSchema = subscriptionFieldsSchema
  .refine((subscription) => !subscription.endDate || subscription.endDate >= subscription.startDate, { message: "End date must be on or after the start date", path: ["endDate"] })
  .refine((subscription) => !subscription.cancelReason || !!subscription.endDate, { message: "A cancel reason requires an end date", path: ["cancelReason"] });

// startDate is part of the key, so the end-date range is re-checked in the service against the stored row.
export const updateSubscriptionSchema = subscriptionFieldsSchema
  .omit({ subscriberId: true, planId: true, startDate: true })
  .partial()
  .refine((subscription) => !subscription.cancelReason || !!subscription.endDate, { message: "A cancel reason requires an end date", path: ["cancelReason"] });

export const cancelSubscriptionSchema = subscriptionKeySchema.extend({
    endDate: isoDateSchema,
    cancelReason: z.string().trim().max(500, "Cancel reason is too long").optional(),
})
  .refine((subscription) => subscription.endDate >= subscription.startDate, { message: "End date must be on or after the start date", path: ["endDate"] });
