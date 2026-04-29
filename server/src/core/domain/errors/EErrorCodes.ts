/**
 * Enum for error codes used in the application.
 * These codes are used to identify specific error scenarios.
 *
 * - `VALIDATION_ERROR` — Validation error occurred.
 * - `ALREADY_EXISTS` — The resource already exists.
 * - `NOT_FOUND` — The requested resource was not found.
 * - `INTERNAL_SERVER_ERROR` — A generic internal server error occurred.
 */
export enum EErrorCodes {
  VALIDATION_ERROR = 'validation-error',
  ALREADY_EXISTS = 'already-exists',
  LIMIT_EXCEEDED = 'limit-exceeded',
  NOT_FOUND = 'not-found',
  INTERNAL_SERVER_ERROR = 'internal-server-error',
  WRONG_PASSWORD = 'wrong-password',
}
