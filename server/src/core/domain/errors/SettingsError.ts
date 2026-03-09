import { BaseApiError, EErrorCodes, ErrorBody } from '@core/domain/errors';

export class SettingsError<T = unknown> extends BaseApiError<T> {
  constructor(status: number, code: string, message: string, body?: ErrorBody<T>) {
    super(status, `settings/${code}`, message, [], body);
  }

  static BadRequest<T = undefined>(code: string, message: string, body?: ErrorBody<T>): SettingsError {
    return new SettingsError(400, code, message, body);
  }

  static NotFound<T = undefined>(setting?: string, body?: ErrorBody<T>): SettingsError {
    const message = setting ? `Settings with this value (${setting}) not found` : `Not found`;
    return new SettingsError(404, EErrorCodes.NOT_FOUND, message, body);
  }
}

// static fromZodError<T = undefined>(error: ZodError, entityMessage = 'settings', body?: ErrorBody<T>) {
//   const formattedErrors: ValidationError[] = error.errors.map((err) => ({
//     path: err.path,
//     message: err.message,
//   }));
//   return new SettingsError(
//     400,
//     EErrorCodes.VALIDATION_ERROR,
//     `${entityMessage} validation failed`,
//     formattedErrors,
//     body,
//   );
//   // return ApiError.fromZodError<T>(error, "setting", body) as SettingsError;
// }
