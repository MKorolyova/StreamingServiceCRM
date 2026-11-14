import { z } from "zod";
import { campaignResponseEnum, campaignTypeEnum } from "@/db/schema";
import { isoDateSchema, listQuerySchema, requireAtLeastOneField, uuidSchema } from "./common";

export const campaignTypeSchema = z.enum(campaignTypeEnum.enumValues, "Invalid campaign type");
export const campaignResponseSchema = z.enum(campaignResponseEnum.enumValues, "Invalid response");

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

// Shared by create and update; refinements are added after, since .partial() can't follow .refine().
const campaignFieldsSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  type: campaignTypeSchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema,
});

export const campaignKeySchema = z.object({ campaignId: uuidSchema });

export const createCampaignSchema = campaignFieldsSchema
  .refine((campaign) => campaign.endDate >= campaign.startDate, { message: "End date must be on or after the start date", path: ["endDate"] });

// Only checks the range when both dates are sent; the service re-checks against stored values.
export const updateCampaignSchema = requireAtLeastOneField(campaignFieldsSchema.partial())
  .refine((campaign) => !campaign.startDate || !campaign.endDate || campaign.endDate >= campaign.startDate, { message: "End date must be on or after the start date", path: ["endDate"] });

export const listCampaignsQuerySchema = listQuerySchema([
  "name",
  "type",
  "startDate",
  "endDate",
]).extend({
  type: campaignTypeSchema.optional(),
  activeOn: isoDateSchema.optional(),
});

// ---------------------------------------------------------------------------
// Campaign targets (campaign <-> subscriber)
// ---------------------------------------------------------------------------

export const campaignTargetKeySchema = z.object({
  campaignId: uuidSchema,
  subscriberId: uuidSchema,
});

export const createCampaignTargetSchema = campaignTargetKeySchema.extend({
  sentDate: isoDateSchema.optional(),
  response: campaignResponseSchema.optional(),
});

export const targetSubscribersSchema = z.object({
  campaignId: uuidSchema,
  subscriberIds: z.array(uuidSchema).min(1, "Select at least one subscriber").max(1000, "At most 1000 subscribers per request"),
})
  .refine((target) => new Set(target.subscriberIds).size === target.subscriberIds.length, { message: "Subscribers must be unique", path: ["subscriberIds"] });

export const updateCampaignTargetSchema = z.object({ response: campaignResponseSchema });

export const listCampaignTargetsQuerySchema = listQuerySchema(["sentDate", "response"]).extend({
  campaignId: uuidSchema,
  response: campaignResponseSchema.optional(),
});
