import { z } from "zod";
import { deviceTypeEnum } from "@/db/schema";
import { listQuerySchema, requireAtLeastOneField, uuidSchema } from "./common";

export const deviceTypeSchema = z.enum(deviceTypeEnum.enumValues, "Invalid device type");

export const deviceKeySchema = z.object({ deviceId: uuidSchema });

export const createDeviceSchema = z.object({
  type: deviceTypeSchema,
  os: z.string().trim().min(1, "OS is required").max(50, "OS is too long"),
  model: z.string().trim().min(1, "Model is required").max(100, "Model is too long"),
});

export const updateDeviceSchema = requireAtLeastOneField(createDeviceSchema.partial());

export const listDevicesQuerySchema = listQuerySchema(["type", "os", "model"]).extend({
  type: deviceTypeSchema.optional(),
});
