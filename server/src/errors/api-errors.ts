import { Error } from "mongoose";
import { ZodError } from "zod";
import { EErrorCodes } from "./error-codes.enum";
import { ValidationError } from "../models/interfaces/error-response.interface";

class ApiErrors extends Error {
  status: number;
  code: string;
  errors: ValidationError[];

  constructor(status: number, code: string, message: string, errors: ValidationError[] = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  static fromZodError = (error: ZodError, entityMessage = "Validation") => {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return new ApiErrors(400, EErrorCodes.VALIDATION_ERROR, `${entityMessage} validation failed`, formattedErrors);
  };

  static BadRequest(code: string, message: string, errors: ValidationError[]) {
    return new ApiErrors(400, code, message, errors);
  }
}
export default ApiErrors;
