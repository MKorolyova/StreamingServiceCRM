import { z } from "zod";
import { userRoleEnum } from "@/db/schema";
import { emailSchema, listQuerySchema, requireAtLeastOneField, uuidSchema } from "./common";

export const userRoleSchema = z.enum(userRoleEnum.enumValues, "Invalid role");

export const userKeySchema = z.object({ userId: uuidSchema });

// Created from the auth provider (Clerk) on sign-up; role stays null until an admin assigns one.
export const createUserSchema = z.object({
  clerkUserId: z.string().trim().min(1, "Clerk user id is required").max(64, "Clerk user id is too long"),
  email: emailSchema,
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  role: userRoleSchema.nullable().optional(),
  isActive: z.boolean("Active must be true or false").optional(),
});

// Admin-managed fields only; identity fields are synced from Clerk.
export const updateUserSchema = requireAtLeastOneField(
  createUserSchema.pick({ name: true, role: true, isActive: true }).partial(),
);

export const syncUserFromAuthSchema = createUserSchema.pick({
  clerkUserId: true,
  email: true,
  name: true,
});

export const listUsersQuerySchema = listQuerySchema(["name", "email", "role", "createdAt"]).extend({
  role: userRoleSchema.optional(),
  isActive: z.stringbool().optional(),
});
