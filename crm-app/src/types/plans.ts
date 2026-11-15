import type { z } from "zod";
import type { plans, resolutionEnum } from "@/db/schema";
import type {
  createPlanSchema,
  paginationPlansSchema,
  planKeySchema,
  updatePlanSchema,
} from "@/validators/plans";

export type Resolution = (typeof resolutionEnum.enumValues)[number];
export type Plan = typeof plans.$inferSelect;
export type PlanKey = z.infer<typeof planKeySchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type ListPlansQuery = z.infer<typeof paginationPlansSchema>;
