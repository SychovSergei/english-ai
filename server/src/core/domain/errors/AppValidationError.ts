import { BaseApiError } from '@core/domain/errors/BaseApiError';
import { EErrorCodes } from '@core/domain/errors/EErrorCodes';
import { IValidationError } from '@core/domain/errors/types';

export class AppValidationError extends BaseApiError<undefined> {
  constructor(entityName: string, errors: IValidationError[]) {
    super(
      400,
      EErrorCodes.VALIDATION_ERROR,
      `${entityName} validation failed`,
      errors,
      undefined, // Body usually is unnecessary here
    );
  }

  /**
   * The fast way to create an error for one field.
   */
  static singleField(entityName: string, path: string, message: string): AppValidationError {
    return new AppValidationError(entityName, [{ path: [path], message }]);
  }
}
