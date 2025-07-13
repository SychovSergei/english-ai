import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ZodError } from 'zod';

import { EErrorCodes } from '@core/domain/enums';
import { ApiErrorInterface, BaseApiError, ValidationError } from '@core/domain/errors';

// export default function errorHandler( //<T = undefined>
export const errorHandler: ErrorRequestHandler = (
  //<T = undefined>
  error: unknown, //Error | BaseApiError<T> | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  // console.error(error); // logging error for debugging

  //// const baseResponse: ApiErrorInterface<T> = {
  const baseResponse: ApiErrorInterface = {
    code: EErrorCodes.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    status: 500,
    validationErrors: [],
  };

  // Если ошибка является экземпляром ApiError
  if (error instanceof BaseApiError) {
    console.log('BaseApiError');
    res.status(error.status).json({
      ...baseResponse,
      code: error.code,
      message: error.message,
      status: error.status,
      validationErrors: error.validationErrors,
      body: error.body,
    });
    return;
  }

  // Если ошибка является экземпляром ZodError
  if (error instanceof ZodError) {
    console.log('ZodError');
    res.status(400).json({
      ...baseResponse,
      code: EErrorCodes.VALIDATION_ERROR,
      message: 'Validation failed',
      status: 400,
      validationErrors: formatZodErrors(error),
    });
    return;
  }

  // Если это стандартная ошибка
  console.log('Standard error');
  res.status(500).json({
    ...baseResponse,
    message: (error as Error).message || baseResponse.message,
  });
  return;
};

function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    path: err.path,
    message: err.message,
  }));
}
