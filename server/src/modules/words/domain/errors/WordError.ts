import { BaseApiError, EErrorCodes } from '@core/domain/errors';
import { ErrorBody } from '@core/domain/errors/types';

export class WordError<TBody = unknown> extends BaseApiError<TBody> {
  constructor(status: number, code: string, message: string, body?: ErrorBody<TBody>) {
    // В бизнес-ошибках validationErrors обычно пустые []
    super(status, `word/${code}`, message, [], body);
  }

  static NotFound(word?: string): WordError {
    const message = word ? `Word with this value (${word}) not found` : `Not found`;
    return new WordError(404, EErrorCodes.NOT_FOUND, message);
  }

  static LimitExceeded(data: { current: number; max: number }): WordError<{ current: number; max: number }> {
    return new WordError(403, EErrorCodes.LIMIT_EXCEEDED, 'Word limit reached for guest', {
      payload: data,
    });
  }

  static AlreadyExists(value: string, existingId: string): WordError<{ id: string }> {
    return new WordError(409, EErrorCodes.ALREADY_EXISTS, `The word (${value}) already exists.`, {
      payload: { id: existingId },
    });
  }

  static AccessDenied<T = undefined>(text?: string): WordError<T> {
    const message = text || `Access Denied`;
    return new WordError(403, EErrorCodes.NOT_FOUND, message, undefined);
  }
}

// static WordValueRequired(msg: string): WordError {
//   return new WordError(400, EErrorCodes.VALIDATION_ERROR, msg, undefined);
// }
//
// static WordTranslationRequired(msg: string): WordError {
//   return new WordError(400, EErrorCodes.VALIDATION_ERROR, msg, undefined);
// }

// static BadRequest<T = undefined>(
//   code: string,
//   message: string,
//   errors: IValidationError[] = [],
//   body?: ErrorBody<T>,
// ): WordError<T> {
//   return new WordError<T>(400, code, message, body);
// }

// static fromZodError<T = undefined>(error: ZodError, entityMessage = 'word', body?: ErrorBody<T>): WordError<T> {
//   const formattedErrors: IValidationError[] = error.errors.map((err) => ({
//   path: err.path,
//   message: err.message,
// }));
// return new BaseApiError<T>(
//   400,
//   EErrorCodes.VALIDATION_ERROR,
//   `${entityMessage} validation failed`,
//   formattedErrors,
//   body,
// );
// }

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
