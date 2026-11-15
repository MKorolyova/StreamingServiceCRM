import { z } from "zod";
import { deviceTypeEnum } from "@/db/schema";
import { 
  uuidSchema,
  paginationSchema,
} from "./common";


export const deviceKeySchema = z.object({ 
  deviceId: uuidSchema 
});

export const createDeviceSchema = z.object({
  type: z.enum(deviceTypeEnum.enumValues, "Invalid device type"),
  os: z.string().trim().min(1, "OS is required").max(50, "OS is too long"),
  model: z.string().trim().min(1, "Model is required").max(100, "Model is too long"),
});

export const updateDeviceSchema = createDeviceSchema
  .partial();

export const paginationDevicesSchema = paginationSchema.extend({
  type: z.enum(deviceTypeEnum.enumValues, "Invalid device type").optional(),
  os: z.string().trim().max(50, "OS is too long").optional(),
  model: z.string().trim().max(100, "Model is too long").optional(),
});
