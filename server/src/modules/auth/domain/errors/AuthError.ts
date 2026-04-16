import { BaseApiError, ErrorBody, IValidationError } from '@core/domain/errors';

export class AuthError<TBody = undefined> extends BaseApiError<TBody> {
  constructor(
    status: number,
    code: string,
    message: string,
    errors: IValidationError[] = [],
    body?: ErrorBody<TBody> | undefined,
  ) {
    super(status, `auth/${code}`, message, errors, body);
    console.log('BaseApiError:', BaseApiError);
  }

  static BadRequest<TBody>(
    code: string,
    message: string,
    errors: IValidationError[] = [],
    body?: ErrorBody<TBody>,
  ): AuthError<TBody> {
    return new AuthError<TBody>(400, code, message, errors, body);
  }

  static Unauthorized(message?: string): AuthError {
    return new AuthError(401, 'invalid_data', message || 'Forbidden', []); //forbidden
  }

  static Forbidden(message?: string): AuthError {
    return new AuthError(403, 'forbidden', message || 'Forbidden', []); //forbidden
  }

  static UnauthorizedAccessToken<TBody>(message?: string): AuthError<TBody> {
    return new AuthError<TBody>(401, 'invalid_access_token', message || 'Forbidden', []); //forbidden
  }

  static UnauthorizedRefreshToken<TBody>(message?: string): AuthError<TBody> {
    return new AuthError<TBody>(401, 'invalid_refresh_token', message || 'Forbidden', []); //forbidden
  }
}

// static fromZodError<TBody>(error: ZodError, entityMessage = 'auth', body?: ErrorBody<TBody>): AuthError<TBody> {
//   // return ApiError.fromZodError(error, "auth") as AuthError;
//   const formattedErrors: IValidationError[] = error.errors.map((err) => ({
//   path: err.path,
//   message: err.message,
// }));
// // return new ApiError(400, EErrorCodes.VALIDATION_ERROR, `${entityMessage} validation failed`, formattedErrors, body);
// return new AuthError<TBody>(
//   400,
//   `zod/${EErrorCodes.VALIDATION_ERROR}`,
//   `${entityMessage}: validation failed`,
//   formattedErrors,
//   body,
// );
// }
