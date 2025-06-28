// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorBody<T> = T extends undefined ? Record<string, any> : T;

export interface ValidationError {
  path: (string | number)[]; // Поле или путь, связанный с ошибкой
  message: string; // Сообщение об ошибке
}

export interface ApiErrorInterface<T = undefined> {
  status: number; // HTTP-статус ошибки
  code: string; // Уникальный код ошибки (например, "word/already-exists")
  message: string; // Сообщение об ошибке
  validationErrors: ValidationError[]; // Опциональные детали (для ошибок валидации)
  body?: ErrorBody<T>; // Дополнительный объект для данных
}

// export interface IWordError extends IApiError {
//   entity: "word";
// }
//
// export interface IUserError extends IApiError {
//   entity: "user";
// }
