import { ZodSchema } from 'zod';

export interface IValidationService {
  validate<T>(data: unknown, schema: ZodSchema, entityMessage: string): T;
}
