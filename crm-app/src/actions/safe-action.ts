import { unstable_rethrow } from "next/navigation";
import { z } from "zod";

import { ActionErrorCode } from "@/constants/action-error-code";
import type { Permission } from "@/constants/permissions";
import { createAuthContext } from "@/lib/auth/auth-context";
import { getCurrentUser } from "@/lib/auth/user-context";
import type { ActionFailure, ActionFieldErrors, ActionResult } from "@/types/actions";
import type { AuthContext } from "@/types/auth";

class ActionError extends Error {
  constructor(
    readonly code: ActionErrorCode,
    message: string,
    readonly fieldErrors?: ActionFieldErrors,
  ) {
    super(message);
    this.name = "ActionError";
  }
}

export function actionError(
  code: ActionErrorCode,
  message: string,
  fieldErrors?: ActionFieldErrors,
): never {
  throw new ActionError(code, message, fieldErrors);
}

function failure(error: ActionFailure): ActionResult<never> {
  return { ok: false, error };
}

type SafeActionOptions<TSchema extends z.ZodType, TOutput> = {
  name: string;
  schema: TSchema;
  permission: Permission | readonly Permission[];
  handler: (input: z.output<TSchema>, context: AuthContext) => Promise<TOutput>;
};

/**
 * Wraps a server action so it always runs the same checks in the same order:
 *
 * 1. Loads the signed-in user, otherwise `UNAUTHORIZED`.
 * 2. Checks the account is approved and `permission` is in the user's role,
 *    otherwise `FORBIDDEN`.
 * 3. Validates the input with `schema`, otherwise `VALIDATION_ERROR` with field errors.
 * 4. Runs `handler` with the parsed input and the auth context.
 *
 * The action never throws to the client: it returns `{ ok: true, data }` or
 * `{ ok: false, error }`.
 */
export function createSafeAction<TSchema extends z.ZodType, TOutput>({
  name,
  schema,
  permission,
  handler,
}: SafeActionOptions<TSchema, TOutput>) {
  return async (input: z.input<TSchema>): Promise<ActionResult<TOutput>> => {
    let userId: string | undefined;

    try {

      const user = await getCurrentUser();
      if (!user) {
        return failure({
          code: ActionErrorCode.UNAUTHORIZED,
          message: "Sign in to continue.",
        });
      }
      
      userId = user.userId;

      if (user.status !== "APPROVED" && user.role === null) {
        return failure({
          code: ActionErrorCode.FORBIDDEN,
          message: "Your account is still waiting for an admin to approve it.",
        });
      }

      const context = createAuthContext(user);

      const required = typeof permission === "string" ? [permission] : permission;
      if (!context.hasPermissions(required)) {
        return failure({
          code: ActionErrorCode.FORBIDDEN,
          message: "You don't have permission to do this.",
        });
      }

      const parsed = await schema.safeParseAsync(input);
      if (!parsed.success) {
        return failure({
          code: ActionErrorCode.VALIDATION_ERROR,
          message: "Check the highlighted fields and try again.",
          fieldErrors: z.flattenError(parsed.error).fieldErrors as ActionFieldErrors,
        });
      }

      return { ok: true, data: await handler(parsed.data, context) };

    } catch (error) {

      unstable_rethrow(error);

      if (error instanceof ActionError) {
        return failure({
          code: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors,
        });
      }

      return failure({
        code: ActionErrorCode.SERVER_ERROR,
        message: "Something went wrong. Try again.",
      });

    }
  };
}
