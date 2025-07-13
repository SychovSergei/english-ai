import { injectable } from 'inversify';
import { z, ZodError, ZodSchema } from 'zod';

import { BaseApiError } from '@core/domain/errors';
import { IValidationService } from '@core/interfaces/validation.service.interface';

@injectable()
export class ValidationService implements IValidationService {
  public validate<TSchema extends ZodSchema<any>>(
    data: unknown,
    schema: TSchema,
    entityMessage = 'Validation',
  ): z.infer<TSchema> {
    const result = schema.safeParse(data);

    if (!result.success) {
      const formattedError = this.formatZodError(result.error);
      throw BaseApiError.fromZodError(result.error, `${entityMessage} failed:: ( ${formattedError} )`);
    }

    return result.data;
  }

  private formatZodError(error: ZodError): string {
    return Object.values(error.format())
      .filter((v: any) => v?._errors?.length)
      .map((v: any) => v._errors.join(', '))
      .join('; ');
  }
}
