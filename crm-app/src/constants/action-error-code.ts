export enum ActionErrorCode {
  // Input
  VALIDATION_ERROR = "VALIDATION_ERROR", // Submitted input failed schema validation.
  BAD_REQUEST = "BAD_REQUEST", // The request is malformed or missing required data.
  PAYLOAD_TOO_LARGE = "PAYLOAD_TOO_LARGE", // The submitted data or file exceeds the size limit.

  // Auth
  UNAUTHORIZED = "UNAUTHORIZED", // The request does not have a signed-in user.
  SESSION_EXPIRED = "SESSION_EXPIRED", // The user's session ended and they must sign in again.
  FORBIDDEN = "FORBIDDEN", // The user is signed in but cannot perform the action.

  // Record state
  NOT_FOUND = "NOT_FOUND", // The requested record does not exist.
  ALREADY_EXISTS = "ALREADY_EXISTS", // A record with the same unique value already exists.
  CONFLICT = "CONFLICT", // The action conflicts with the current record state.
  EXPIRED = "EXPIRED", // The action, token, or requested operation has expired.

  // Limits and availability
  RATE_LIMITED = "RATE_LIMITED", // Too many requests in a short time; retry later.
  TIMEOUT = "TIMEOUT", // The operation took too long and was stopped.
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE", // The service is temporarily down or in maintenance.

  // Failures
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR", // A third-party service failed or rejected the call.
  DATABASE_ERROR = "DATABASE_ERROR", // A database query or transaction failed.
  SERVER_ERROR = "SERVER_ERROR", // An unexpected server-side failure occurred.
}
