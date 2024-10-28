import { Error } from "mongoose";
import { ValidationError } from "express-validator";

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

  static BadRequest(code: string, message: string, errors: ValidationError[]) {
    return new ApiErrors(400, code, message, errors);
  }
}
export default ApiErrors;
