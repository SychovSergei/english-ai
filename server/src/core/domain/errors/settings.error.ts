import { ZodError } from 'zod';

import { EErrorCodes } from '@core/domain/enums';
import { ErrorBody, ServerApiError, ValidationError } from '@core/domain/errors';

export class SettingsError<T = undefined> extends ServerApiError<T> {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    super(status, `setting/${code}`, message, errors, body);
  }

  static fromZodError<T = undefined>(error: ZodError, entityMessage = 'settings', body?: ErrorBody<T>) {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return new ServerApiError<T>(
      400,
      EErrorCodes.VALIDATION_ERROR,
      `${entityMessage} validation failed`,
      formattedErrors,
      body,
    );
    // return ApiError.fromZodError<T>(error, "setting", body) as SettingsError;
  }

  static BadRequest<T = undefined>(code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    return new SettingsError(400, code, message, errors, body);
  }

  static NotFound<T = undefined>(setting?: string, body?: ErrorBody<T>) {
    const message = setting ? `Settings with this value (${setting}) not found` : `Not found`;
    return new SettingsError(404, EErrorCodes.NOT_FOUND, message, [], body);
  }
}
