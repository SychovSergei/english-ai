import { ZodError } from 'zod';

import { EErrorCodes } from '@core/domain/enums';
import { BaseApiError, ErrorBody, ValidationError } from '@core/domain/errors';

export class UserError<T = undefined> extends BaseApiError<T> {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    super(status, `user/${code}`, message, errors, body);
  }

  static fromZodError<T = undefined>(error: ZodError, entityMessage = 'user', body?: ErrorBody<T>) {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return new BaseApiError(
      400,
      EErrorCodes.VALIDATION_ERROR,
      `${entityMessage} validation failed`,
      formattedErrors,
      body,
    );
  }

  static BadRequest<T = undefined>(
    code: string,
    message: string,
    errors: ValidationError[] = [],
    body?: ErrorBody<T>,
  ): UserError<T> {
    return new UserError<T>(400, code, message, errors, body);
  }

  // static AlreadyExists = (email: string) =>
  //   new UserError(409, EErrorCodes.ALREADY_EXISTS, `user-model with email: ${email} already exists`);

  static AlreadyExists<T = undefined>(email: string, body?: ErrorBody<T>): UserError<T> {
    return new UserError<T>(409, EErrorCodes.ALREADY_EXISTS, `User with email: ${email} already exists`, [], body);
  }

  // static NotFound(email?: string) {
  //   const message = email ? `Not found` : `user-model with email: ${email} not found`;
  //   return new UserError(404, EErrorCodes.NOT_FOUND, message);
  // }
  static NotFound<T = undefined>(email?: string, body?: ErrorBody<T>): UserError<T> {
    const message = email ? `User with email: ${email} not found` : `Not found`;
    return new UserError<T>(404, EErrorCodes.NOT_FOUND, message, [], body);
  }

  static WrongPassword() {
    return new UserError(400, 'wrong-password', 'Password is incorrect!');
  }
}
