import { ZodSchema } from "zod";
import ApiError from "../../core/errors/api-error";

export class Validation {
  public static validate<T>(data: unknown, schema: ZodSchema, entityMessage = "validation"): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw ApiError.fromZodError(result.error, `${entityMessage}:: ( ` + result.error.toString() + ` )`);
    }
    return result.data;
  }
}
