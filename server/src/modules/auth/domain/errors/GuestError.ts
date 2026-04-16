import { BaseApiError, EErrorCodes, ErrorBody } from '@core/domain/errors';

export class GuestError<T = undefined> extends BaseApiError<T> {
  constructor(status: number, code: string, message: string, body?: ErrorBody<T>) {
    super(status, `guest/${code}`, message, [], body);
  }

  static BadRequest<T = undefined>(code: string, message: string, body?: ErrorBody<T>): GuestError<T> {
    return new GuestError<T>(400, code, message, body);
  }

  static LimitExceeded(msg: string): GuestError {
    return new GuestError(400, EErrorCodes.LIMIT_EXCEEDED, msg);
  }

  // static AlreadyExists<T = undefined>(email: string, body?: ErrorBody<T>): UserError<T> {
  //   return new UserError<T>(409, EErrorCodes.ALREADY_EXISTS, `User with email: ${email} already exists`, body);
  // }
  //
  // static NotFoundByEmail<T = undefined>(email?: string, body?: ErrorBody<T>): UserError<T> {
  //   const message = `User with email: ${email} not found`;
  //   return new UserError<T>(404, EErrorCodes.NOT_FOUND, message, body);
  // }
  //
  // static NotFound<T = undefined>(message: string = 'User not found', body?: ErrorBody<T>): UserError<T> {
  //   return new UserError<T>(404, EErrorCodes.NOT_FOUND, message, body);
  // }
}

// static fromZodError<T = undefined>(error: ZodError, entityMessage = 'user', body?: ErrorBody<T>) {
//   const formattedErrors: IValidationError[] = error.errors.map((err) => ({
//     path: err.path,
//     message: err.message,
//   }));
//   return new UserError(
//     400,
//     EErrorCodes.VALIDATION_ERROR,
//     `${entityMessage} validation failed`,
//     formattedErrors,
//     body,
//   );
// }
