import { z } from "zod";

import { userRoleEnum, userStatusEnum } from "@/db/schema";
import { paginationSchema } from "@/validators/common";
import { updateUserSchema, userKeySchema } from "@/validators/users";

export const USER_SORT_COLUMNS = ["name", "role", "created", "updated"] as const;

/** Search params of the users page. Unknown filter values are dropped instead of failing the page. */
export const listUsersPageSchema = paginationSchema.extend({
  sortBy: z.enum(USER_SORT_COLUMNS).default("name").catch("name"),
  role: z.enum(userRoleEnum.enumValues).optional().catch(undefined),
  status: z.enum(userStatusEnum.enumValues).optional().catch(undefined),
});

export type ListUsersPageQuery = z.infer<typeof listUsersPageSchema>;

/** Approve with a role, change the role, or reset to pending (which removes the role). */
export const updateUserAccessSchema = z.intersection(userKeySchema, updateUserSchema);

export type UpdateUserAccessInput = z.input<typeof updateUserAccessSchema>;
