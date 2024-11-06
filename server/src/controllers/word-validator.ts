import { WordError } from "../errors/word-error";
import { WordRequestDtoSchema } from "../models/schemas/word-schemas";

export class WordValidation {
  private static schema = WordRequestDtoSchema;

  public static validate<T>(data: unknown) {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      throw WordError.fromZodError(result.error);
    }
    return result.data as T;
  }
}
