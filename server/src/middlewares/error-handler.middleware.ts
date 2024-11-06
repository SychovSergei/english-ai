import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import ApiErrors from "../errors/api-error";
import { EErrorCodes } from "../errors/error-codes.enum";
import { ErrorResponse } from "../models/interfaces/error-response.interface";
import { ValidationError } from "../models/interfaces/error-response.interface";

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export default function errorHandler(error: Error | ApiErrors, req: Request, res: Response, next: NextFunction) {
  // logging error for debugging
  console.error(error);

  const response: ErrorResponse = {
    code: EErrorCodes.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  };

  if (error instanceof ApiErrors) {
    const { code, message, errors } = error;
    response.code = code;
    response.message = message;
    response.errors = errors;

    return res.status(error.status).json(response);
  }

  if (error instanceof ZodError) {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    response.code = EErrorCodes.VALIDATION_ERROR;
    response.message = "Validation failed";
    response.errors = formattedErrors;

    return res.status(400).json(response);
  }

  response.message = error.message || "Internal server error";

  return res.status(500).json(response);
}
