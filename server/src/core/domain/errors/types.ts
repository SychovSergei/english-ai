export interface IValidationError {
  path: (string | number)[]; // ['translations', 0, 'value']
  message: string;
}

export interface ErrorBody<TPayload = unknown> {
  payload?: TPayload;
  [key: string]: unknown;
}

export interface ApiError<TBody = unknown> {
  status: number;
  code: string;
  message: string;
  timestamp: number;
  validationErrors: IValidationError[];
  body?: ErrorBody<TBody>;
}
