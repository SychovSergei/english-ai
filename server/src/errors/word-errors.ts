import { ZodError } from "zod";

import ApiErrors from "./api-errors";
import { EErrorCodes } from "./error-codes.enum";
import { ValidationError } from "../models/interfaces/error-response.interface";

export class WordErrors extends ApiErrors {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = []) {
    super(status, `word/${code}`, message, errors);
  }

  static fromZodError = (error: ZodError) => {
    return ApiErrors.fromZodError(error, "Word") as WordErrors;
  };

  static BadRequest = (code: string, message: string) => new WordErrors(400, code, message);

  static AlreadyExists = (word: string) =>
    new WordErrors(409, EErrorCodes.ALREADY_EXISTS, `The word with this value (${word}) already exists.`);

  static NotFound(word?: string) {
    const message = word ? `Not found` : `Word with this value (${word}) not found`;
    return new WordErrors(404, EErrorCodes.NOT_FOUND, message);
  }
}
