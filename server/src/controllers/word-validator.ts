import { WordErrors } from "../errors/word-errors";
import { WordRequestDtoSchema } from "../models/schemas/word-schemas";

export class WordValidation {
  private static schema = WordRequestDtoSchema;

  public static validate<T>(data: unknown) {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      throw WordErrors.fromZodError(result.error);
    }
    return result.data as T;
  }
}
