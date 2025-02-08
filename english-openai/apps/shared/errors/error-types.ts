import {
  ApiErrorInterface,
  ErrorBody,
  ValidationError,
} from "../../server/src/core/errors/api-error";

export type SharedErrorBody<T> = ErrorBody<T>;

/** SHARED file */
export interface SharedValidationError extends ValidationError {}
// path: (string | number)[]; // Поле или путь, связанный с ошибкой
// message: string; // Сообщение об ошибке

/** SHARED file */
export interface SharedApiErrorInterface<T = undefined>
  extends ApiErrorInterface<T> {}
// status: number; // HTTP-статус ошибки
// code: string; // Уникальный код ошибки (например, "word/already-exists")
// message: string; // Сообщение об ошибке
// validationErrors: SharedValidationError[]; // Опциональные детали (для ошибок валидации)
// body?: SharedErrorBody<TBody>; // Дополнительный объект для данных
// export interface IZodValidationError extends IApiError {
//   errors: IValidationError[]; // Детализация ошибок Zod
// }
// export interface IWordError extends IApiError {
//   entity: "word";
// }
//
// export interface IUserError extends IApiError {
//   entity: "user";
// }
