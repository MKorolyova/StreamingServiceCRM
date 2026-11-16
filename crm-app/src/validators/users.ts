import { z } from "zod";
import { userRoleEnum, userStatusEnum } from "@/db/schema";
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
});

export const updateUserSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("APPROVED"),
    role: z.enum(userRoleEnum.enumValues, "Choose a role to approve this user"),
  }),
  z.object({ status: z.literal("PENDING") }),
], "Invalid status");

export const paginationUsersSchema = paginationSchema.extend({
  role: z.enum(userRoleEnum.enumValues, "Invalid role").optional(),
  status: z.enum(userStatusEnum.enumValues, "Invalid status").optional(),
});
