import { z } from "zod";
import { userRoleEnum } from "@/db/schema";
import { 
  emailSchema, 
  uuidSchema,
  paginationSchema,
} from "./common";


export const userKeySchema = z.object({ userId: uuidSchema });

export const createUserSchema = z.object({
  clerkUserId: z.string().trim().min(1, "Clerk user id is required").max(64, "Clerk user id is too long"),
  email: emailSchema,
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  role: z.enum(userRoleEnum.enumValues, "Invalid role").nullable().optional(),
  isActive: z.boolean("Active must be true or false").optional(),
});

export const updateUserSchema = createUserSchema
  .omit({ clerkUserId: true, email: true, name: true })
  .partial();

export const paginationUsersSchema = paginationSchema.extend({
  role: z.enum(userRoleEnum.enumValues, "Invalid role").optional(),
  isActive: z.boolean("Active must be true or false").optional(),
});
