export interface ErrorResponse {
  code: string;
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: (string | number)[];
  message: string;
}
