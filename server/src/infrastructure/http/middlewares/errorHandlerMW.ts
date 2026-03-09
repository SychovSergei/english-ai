import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

// import { Error } from 'mongoose';
// import { EErrorCodes } from '@core/domain/enums';
import { ApiError, BaseApiError, EErrorCodes, IValidationError } from '@core/domain/errors';

// export default function errorHandler( //<T = undefined>
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('[Error]:', err); // logging error for debugging

  // 1. If error is a custom error BaseApiError
  if (err instanceof BaseApiError) {
    // console.log('BaseApiError');
    res.status(err.status).json({
      // ...baseResponse,
      status: err.status,
      code: err.code,
      message: err.message,
      timestamp: err.timestamp,
      errors: err.validationErrors,
      body: err.body,
    });
  }

  // 2. Logging an unknown error (Critical)
  console.error('[Unhandled Error]:', err);

  // 3. response for unknown error (to don't leak information to the client)
  res.status(500).json({
    status: 500,
    code: EErrorCodes.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    timestamp: Date.now(),
    validationErrors: [],
  });
};

// Если ошибка является экземпляром ZodError
// if (error instanceof ZodError) {
//   console.log('ZodError');
//   res.status(400).json({
//     ...baseResponse,
//     code: EErrorCodes.VALIDATION_ERROR,
//     message: 'Validation failed',
//     status: 400,
//     errors: formatZodErrors(error),
//   });
//   return;
// }

// function formatZodErrors(error: ZodError): IValidationError[] {
//   return error.errors.map((err) => ({
//     path: err.path,
//     message: err.message,
//   }));
// }
