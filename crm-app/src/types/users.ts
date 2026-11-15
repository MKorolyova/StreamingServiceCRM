import type { z } from "zod";
import type { users } from "@/db/schema";
import type {
  createUserSchema,
  paginationUsersSchema,
  updateUserSchema,
  userKeySchema,
} from "@/validators/users";

export type User = typeof users.$inferSelect;
export type UserKey = z.infer<typeof userKeySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof paginationUsersSchema>;
