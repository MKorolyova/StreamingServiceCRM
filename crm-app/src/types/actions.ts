import type { ActionErrorCode } from "@/constants/action-error-code";

export type ActionFieldErrors = Record<string, string[]>;

export type ActionFailure = {
  code: ActionErrorCode;
  message: string;
  fieldErrors?: ActionFieldErrors;
};

export type ActionResult<TOutput> =
  | { ok: true; data: TOutput }
  | { ok: false; error: ActionFailure };
