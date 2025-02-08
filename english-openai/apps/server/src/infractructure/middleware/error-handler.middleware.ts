import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { EErrorCodes } from "@shared/errors/error-codes.enum";
import { ValidationError } from "../../core/errors/api-error";
import ServerApiError, { ApiErrorInterface } from "../../core/errors/api-error";

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export default function errorHandler<T = undefined>(
  error: Error | ServerApiError<T> | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  console.error(error); // logging error for debugging

  const baseResponse: ApiErrorInterface<T> = {
    // const baseResponse: ErrorResponse<T> = {
    code: EErrorCodes.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
    status: 500,
    validationErrors: [],
  };

  // Если ошибка является экземпляром ApiError
  if (error instanceof ServerApiError) {
    console.log("ServerApiError");
    return res.status(error.status).json({
      ...baseResponse,
      code: error.code,
      message: error.message,
      status: error.status,
      validationErrors: error.validationErrors,
      body: error.body,
    });
  }

  // Если ошибка является экземпляром ZodError
  if (error instanceof ZodError) {
    console.log("ZodError");
    return res.status(400).json({
      ...baseResponse,
      code: EErrorCodes.VALIDATION_ERROR,
      message: "Validation failed",
      status: 400,
      validationErrors: formatZodErrors(error),
    });
  }

  // Если это стандартная ошибка
  console.log("Standard error");
  return res.status(500).json({
    ...baseResponse,
    message: error.message || baseResponse.message,
  });
}

function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    path: err.path,
    message: err.message,
  }));
}
