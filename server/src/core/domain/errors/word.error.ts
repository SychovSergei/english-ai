import { ZodError } from 'zod';

import { EErrorCodes } from '@core/domain/enums';
import { ErrorBody, ServerApiError, ValidationError } from '@core/domain/errors';

export class WordError<T = undefined> extends ServerApiError<T> {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    super(status, `word/${code}`, message, errors, body);
  }

  static fromZodError<T = undefined>(error: ZodError, entityMessage = 'word', body?: ErrorBody<T>) {
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
  }

  // static fromZodError<T = undefined>(error: ZodError, entityMessage = "word"): WordError<T> {
  //   const formattedErrors: IValidationError[] = error.errors.map((err) => ({
  //     path: err.path,
  //     message: err.message,
  //   }));
  //
  //   return new WordError<T>(
  //     400,
  //     `zod/${EErrorCodes.VALIDATION_ERROR}`,
  //     `${entityMessage}: validation failed`,
  //     formattedErrors,
  //     undefined,
  //   );
  // }

  static BadRequest<T = undefined>(
    code: string,
    message: string,
    errors: ValidationError[] = [],
    body?: ErrorBody<T>,
  ): WordError<T> {
    return new WordError<T>(400, code, message, errors, body);
  }

  static AlreadyExists<T = undefined>(word: string, body?: ErrorBody<T>): WordError<T> {
    return new WordError<T>(
      409,
      EErrorCodes.ALREADY_EXISTS,
      `The word with this value (${word}) already exists.`,
      [],
      body,
    );
  }

  static NotFound<T = undefined>(word?: string): WordError<T> {
    const message = word ? `Not found` : `Word with this value (${word}) not found`;
    return new WordError<T>(404, EErrorCodes.NOT_FOUND, message, [], undefined);
  }

  static AccessDenied<T = undefined>(text?: string): WordError<T> {
    const message = text || `Access Denied`;
    return new WordError<T>(404, EErrorCodes.NOT_FOUND, message, [], undefined);
  }
}
