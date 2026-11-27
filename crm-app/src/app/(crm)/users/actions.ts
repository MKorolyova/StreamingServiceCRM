"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { eq } from "drizzle-orm";
import type { z } from "zod";

import { actionError, createSafeAction } from "@/actions/safe-action";
import { ActionErrorCode } from "@/constants/action-error-code";
import type { Permission } from "@/constants/permissions";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { AuthContext } from "@/types/auth";
import type { UserKey } from "@/types/users";

import { getUserById, type UserListEntry } from "./queries";
import { updateUserAccessSchema } from "./validators";

// ---------------------------------------------------------------------------
// Users safe action
//
// Not exported on purpose: every export of a "use server" file becomes an
// action the browser can call, and Next.js only allows async functions there.
// ---------------------------------------------------------------------------

type UserSafeActionOptions<TSchema extends z.ZodType<UserKey>, TOutput> = {
  name: string;
  /** Must include the `userId` of the user being acted on. */
  schema: TSchema;
  /** Defaults to `users.manage`, which only admins hold. */
  permission?: Permission | readonly Permission[];
  /** Lets the signed-in admin act on their own account. Off by default, so no admin can lock themselves out. */
  allowSelf?: boolean;
  /** Extra non-sensitive fields for the success log, such as the role before and after. */
  logContext?: (input: z.output<TSchema>, targetUser: UserListEntry) => Record<string, unknown>;
  handler: (input: z.output<TSchema>, targetUser: UserListEntry, context: AuthContext) => Promise<TOutput>;
};

/**
 * Builds a server action that changes one staff user, on top of the shared `createSafeAction`:
 *
 * 1. Everything `createSafeAction` checks: signed in, approved, permission, valid input.
 * 2. Refuses to act on the signed-in admin's own account, unless `allowSelf` is set.
 * 3. Loads the target user, otherwise `NOT_FOUND`, and hands it to `handler`.
 * 4. Logs success with the action, target and actor; logs unexpected failures.
 * 5. Refreshes the users page so the change shows straight away.
 */
function createUserSafeAction<TSchema extends z.ZodType<UserKey>, TOutput>({
  name,
  schema,
  permission = "users.manage",
  allowSelf = false,
  logContext,
  handler,
}: UserSafeActionOptions<TSchema, TOutput>) {
  return createSafeAction({
    name,
    schema,
    permission,
    handler: async (input, context) => {
      const { userId } = input as UserKey;
      const logFields = { action: name, userId, actorUserId: context.user.userId };

      if (!allowSelf && userId === context.user.userId) {
        actionError(ActionErrorCode.FORBIDDEN, "You can't change your own account here. Ask another admin to do it.");
      }

      const targetUser = await getUserById(userId);
      if (!targetUser) {
        actionError(ActionErrorCode.NOT_FOUND, "This user no longer exists. Refresh the page to see the current list.");
      }

      const startedAt = performance.now();
      try {
        const output = await handler(input, targetUser, context);

        console.info("User action succeeded", {
          ...logFields,
          ...logContext?.(input, targetUser),
          durationMs: Math.round(performance.now() - startedAt),
        });
        revalidatePath("/users");
        return output;
      } catch (error) {
        unstable_rethrow(error);
        // Expected failures from actionError are answers, not faults; only log the rest.
        if (!(error instanceof Error && error.name === "ActionError")) {
          console.error("User action failed", { ...logFields, error });
        }
        throw error;
      }
    },
  });
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/** Approves a pending user with a role, changes an approved user's role, or resets a user to pending. */
export const updateUserAccessAction = createUserSafeAction({
  name: "updateUserAccessAction",
  schema: updateUserAccessSchema,
  logContext: (input, targetUser) => ({
    fromStatus: targetUser.status,
    fromRole: targetUser.role,
    toStatus: input.status,
    toRole: input.status === "APPROVED" ? input.role : null,
  }),
  handler: async (input, targetUser) => {
    // Status and role always change together: approved users have a role, pending users don't.
    const role = input.status === "APPROVED" ? input.role : null;

    // Already in the requested state, for example after another admin made the same change.
    if (targetUser.status === input.status && targetUser.role === role) {
      return { userId: targetUser.userId, name: targetUser.name, status: targetUser.status, role: targetUser.role };
    }

    const [updated] = await db
      .update(users)
      .set({ status: input.status, role })
      .where(eq(users.userId, input.userId))
      .returning({ userId: users.userId, name: users.name, status: users.status, role: users.role });

    if (!updated) {
      actionError(ActionErrorCode.NOT_FOUND, "This user no longer exists. Refresh the page to see the current list.");
    }

    return updated;
  },
});
