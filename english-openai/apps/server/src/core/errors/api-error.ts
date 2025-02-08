import { Error } from "mongoose";
import { ZodError } from "zod";
import { EErrorCodes } from "@shared/errors/error-codes.enum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorBody<T> = T extends undefined ? Record<string, any> : T;

// interface ErrorBodyDefault {
//   [key: string]: any;
// }

// export interface ErrorBody<T = undefined> {
//   // body: T extends undefined ? ([key: string]: any) : T;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }

export interface ValidationError {
  path: (string | number)[]; // Поле или путь, связанный с ошибкой
  message: string; // Сообщение об ошибке
}

export interface ApiErrorInterface<T = undefined> {
  status: number;
  code: string;
  message: string;
  validationErrors: ValidationError[];
  body?: ErrorBody<T>;
}

class ServerApiError<T = undefined> extends Error implements ApiErrorInterface<T> {
  status: number;
  code: string;
  message: string;
  validationErrors: ValidationError[];
  body?: ErrorBody<T>;

  constructor(status: number, code: string, message: string, errors: ValidationError[] = [], body?: ErrorBody<T>) {
    super(message);
    this.message = message;
    this.status = status;
    this.code = code;
    this.validationErrors = errors;
    this.body = body;
  }

  static fromZodError<T = undefined>(error: ZodError, entityMessage = "Validation", body?: ErrorBody<T>) {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    return new ServerApiError(
      400,
      EErrorCodes.VALIDATION_ERROR,
      `${entityMessage} validation failed`,
      formattedErrors,
      body,
    );
  }

  // static fromZodError2 = (error: ZodError, entityMessage = "validation") => {
  //   const formattedErrors: IValidationError[] = error.errors.map((err) => ({
  //     path: err.path,
  //     message: err.message,
  //   }));
  //   return new ApiError(
  //     400, //status
  //     `zod/` + EErrorCodes.VALIDATION_ERROR, //code
  //     `${entityMessage}: validation failed`,
  //     formattedErrors, //validationErrors,
  //     {},
  //   );
  // };

  static BadRequest<T = undefined>(code: string, message: string, errors: ValidationError[], body?: ErrorBody<T>) {
    return new ServerApiError<T>(400, code, message, errors, body);
  }
}
export default ServerApiError;
