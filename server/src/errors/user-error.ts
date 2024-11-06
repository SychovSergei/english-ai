import { ZodError } from "zod";

import ApiErrors from "./api-error";
import { EErrorCodes } from "./error-codes.enum";
import { ValidationError } from "../models/interfaces/error-response.interface";

export class UserError extends ApiErrors {
  constructor(status: number, code: string, message: string, errors: ValidationError[] = []) {
    super(status, `user/${code}`, message, errors);
  }

  static fromZodError = (error: ZodError) => {
    return ApiErrors.fromZodError(error, "User") as UserError;
  };

  static BadRequest = (code: string, message: string) => new UserError(400, code, message);

  static AlreadyExists = (email: string) =>
    new UserError(409, EErrorCodes.ALREADY_EXISTS, `User with email: ${email} already exists`);

  static NotFound(email?: string) {
    const message = email ? `Not found` : `User with email: ${email} not found`;
    return new UserError(404, EErrorCodes.NOT_FOUND, message);
  }
}
