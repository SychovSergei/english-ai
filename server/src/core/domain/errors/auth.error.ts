import { ZodError } from 'zod';

import { EErrorCodes } from '@core/domain/enums';
import { ErrorBody, ServerApiError, ValidationError } from '@core/domain/errors/api.error';

export class AuthError<T = undefined> extends ServerApiError<T> {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    super(status, `auth/${code}`, message, errors, body);
  }

  static fromZodError<T = undefined>(error: ZodError, entityMessage = 'auth', body?: ErrorBody<T>): AuthError<T> {
    // return ApiError.fromZodError(error, "auth") as AuthError;
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    // return new ApiError(400, EErrorCodes.VALIDATION_ERROR, `${entityMessage} validation failed`, formattedErrors, body);
    return new AuthError<T>(
      400,
      `zod/${EErrorCodes.VALIDATION_ERROR}`,
      `${entityMessage}: validation failed`,
      formattedErrors,
      body,
    );
  }

  static BadRequest<T = undefined>(code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    return new AuthError<T>(400, code, message, errors, body);
  }

  static UnauthorizedAccessToken<T = undefined>(message?: string) {
    return new AuthError<T>(401, 'invalid_access_token', message || 'Forbidden', []); //forbidden
  }

  static UnauthorizedRefreshToken<T = undefined>(message?: string) {
    return new AuthError<T>(401, 'invalid_refresh_token', message || 'Forbidden', []); //forbidden
  }
}
