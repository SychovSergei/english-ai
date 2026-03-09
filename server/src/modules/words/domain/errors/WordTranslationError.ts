import { BaseApiError, EErrorCodes, ErrorBody } from '@core/domain/errors';

export class WordTranslationError<TBody = unknown> extends BaseApiError<TBody> {
  constructor(status: number, code: string, message: string, body?: ErrorBody<TBody>) {
    super(status, `word-translation/${code}`, message, [], body);
  }

  static AlreadyExists(word: string, existingId: string): WordTranslationError<{ id: string }> {
    return new WordTranslationError(
      409,
      EErrorCodes.ALREADY_EXISTS,
      `The word translation value '${word}' already exists.`,
      { payload: { id: existingId } },
    );
  }

  static NotFound(value?: string): WordTranslationError {
    const message = value ? `Translation not found` : `Word translation with this value (${value}) not found`;
    return new WordTranslationError(404, EErrorCodes.NOT_FOUND, message, undefined);
  }
}

// static BadRequest<T = undefined>(
//   code: string,
//   message: string,
//   errors: ValidationError[] = [],
//   body?: ErrorBody<T>,
// ): WordTranslationError<T> {
//   return new WordTranslationError<T>(400, code, message, errors, body);
// }
