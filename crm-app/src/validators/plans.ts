import { z } from "zod";
import { resolutionEnum } from "@/db/schema";
import { listQuerySchema, requireAtLeastOneField, uuidSchema } from "./common";

export const resolutionSchema = z.enum(resolutionEnum.enumValues, "Invalid resolution");

export const planKeySchema = z.object({ planId: uuidSchema });

export const createPlanSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name is too long"),
  monthlyPriceCents: z.number("Price must be a number").int("Price must be in whole cents").min(0, "Price cannot be negative").max(2_147_483_647, "Price is too large"),
  maxStreams: z.number("Max streams must be a number").int("Max streams must be a whole number").min(1, "Must allow at least 1 stream").max(32_767, "Max streams is too large"),
  maxProfiles: z.number("Max profiles must be a number").int("Max profiles must be a whole number").min(1, "Must allow at least 1 profile").max(32_767, "Max profiles is too large"),
  resolution: resolutionSchema,
});

export const updatePlanSchema = requireAtLeastOneField(createPlanSchema.partial());

export const listPlansQuerySchema = listQuerySchema([
  "name",
  "monthlyPriceCents",
  "maxStreams",
  "resolution",
]).extend({
  resolution: resolutionSchema.optional(),
});
