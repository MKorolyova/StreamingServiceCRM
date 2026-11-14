import type { z } from "zod";
import type { campaignTargets, campaigns } from "@/db/schema";
import type {
  campaignKeySchema,
  campaignResponseSchema,
  campaignTargetKeySchema,
  campaignTypeSchema,
  createCampaignSchema,
  createCampaignTargetSchema,
  listCampaignTargetsQuerySchema,
  listCampaignsQuerySchema,
  targetSubscribersSchema,
  updateCampaignSchema,
  updateCampaignTargetSchema,
} from "@/validators/campaigns";

export type CampaignType = z.infer<typeof campaignTypeSchema>;
export type CampaignResponse = z.infer<typeof campaignResponseSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type CampaignKey = z.infer<typeof campaignKeySchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type ListCampaignsQuery = z.infer<typeof listCampaignsQuerySchema>;

export type CampaignTarget = typeof campaignTargets.$inferSelect;
export type CampaignTargetKey = z.infer<typeof campaignTargetKeySchema>;
export type CreateCampaignTargetInput = z.infer<typeof createCampaignTargetSchema>;
export type TargetSubscribersInput = z.infer<typeof targetSubscribersSchema>;
export type UpdateCampaignTargetInput = z.infer<typeof updateCampaignTargetSchema>;
export type ListCampaignTargetsQuery = z.infer<typeof listCampaignTargetsQuerySchema>;
