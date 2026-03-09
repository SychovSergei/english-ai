import { ApiError, ErrorBody, IValidationError } from '@core/domain/errors/types';

export abstract class BaseApiError<TBody = unknown> extends Error implements ApiError<TBody> {
  public readonly timestamp: number;

  protected constructor(
    public readonly status: number,
    public readonly code: string,
    public override readonly message: string,
    public readonly validationErrors: IValidationError[] = [],
    public readonly body?: ErrorBody<TBody>,
  ) {
    super(message);
    this.timestamp = Date.now();

    // Важно: наследование от Error в TypeScript ломает stack trace без этой строчки
    Object.setPrototypeOf(this, new.target.prototype);

    // Сохраняем имя класса для отладки
    this.name = this.constructor.name;
  }
}

// toJSON(): ApiError<T> {
//   return {
//     status: this.status,
//     code: this.code,
//     message: this.message,
//     errors: this.errors,
//     body: this.body,
//     timestamp: this.timestamp,
//   };
// }

// static fromZodError<T = undefined>(error: ZodError, entityMessage = 'Validation', body?: ErrorBody<T>) {
//   const formattedErrors: ValidationError[] = error.errors.map((err) => ({
//     path: err.path,
//     message: err.message,
//   }));
//   return new BaseApiError(
//     400,
//     EErrorCodes.VALIDATION_ERROR,
//     `${entityMessage} validation failed`,
//     formattedErrors,
//     body,
//   );
// }
