import type { z } from "zod";
import type { devices } from "@/db/schema";
import type {
  createDeviceSchema,
  deviceKeySchema,
  deviceTypeSchema,
  listDevicesQuerySchema,
  updateDeviceSchema,
} from "@/validators/devices";

export type DeviceType = z.infer<typeof deviceTypeSchema>;
export type Device = typeof devices.$inferSelect;
export type DeviceKey = z.infer<typeof deviceKeySchema>;
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
export type ListDevicesQuery = z.infer<typeof listDevicesQuerySchema>;
