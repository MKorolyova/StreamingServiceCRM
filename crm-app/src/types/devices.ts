import type { z } from "zod";
import type { deviceTypeEnum, devices } from "@/db/schema";
import type {
  createDeviceSchema,
  deviceKeySchema,
  paginationDevicesSchema,
  updateDeviceSchema,
} from "@/validators/devices";

export type DeviceType = (typeof deviceTypeEnum.enumValues)[number];
export type Device = typeof devices.$inferSelect;
export type DeviceKey = z.infer<typeof deviceKeySchema>;
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
export type ListDevicesQuery = z.infer<typeof paginationDevicesSchema>;
