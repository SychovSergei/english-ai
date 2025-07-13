import { ZodError } from 'zod';

import { EErrorCodes } from '@core/domain/enums';
import { BaseApiError, ErrorBody, ValidationError } from '@core/domain/errors';

export class WordTranslationError<T = unknown> extends BaseApiError<T> {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    super(status, `word-translation/${code}`, message, errors, body);
  }

  static fromZodError<T = undefined>(error: ZodError, entityMessage = 'word-translation', body?: ErrorBody<T>) {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return new BaseApiError<T>(
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
  ): WordTranslationError<T> {
    return new WordTranslationError<T>(400, code, message, errors, body);
  }

  static AlreadyExists<T = undefined>(word: string, body?: ErrorBody<T>): WordTranslationError<T> {
    return new WordTranslationError<T>(
      409,
      EErrorCodes.ALREADY_EXISTS,
      `The word translation with value '${word}' already exists.`,
      [],
      body,
    );
  }

  static NotFound<T = undefined>(word?: string): WordTranslationError<T> {
    const message = word ? `Translation not found` : `Word translation with this value (${word}) not found`;
    return new WordTranslationError<T>(404, EErrorCodes.NOT_FOUND, message, [], undefined);
  }
}
