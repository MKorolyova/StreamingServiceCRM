import type { z } from "zod";
import type { plans } from "@/db/schema";
import type {
  createPlanSchema,
  listPlansQuerySchema,
  planKeySchema,
  resolutionSchema,
  updatePlanSchema,
} from "@/validators/plans";

export type Resolution = z.infer<typeof resolutionSchema>;
export type Plan = typeof plans.$inferSelect;
export type PlanKey = z.infer<typeof planKeySchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type ListPlansQuery = z.infer<typeof listPlansQuerySchema>;
