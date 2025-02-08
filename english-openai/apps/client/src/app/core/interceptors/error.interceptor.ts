import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SharedApiErrorInterface } from '@shared/errors/error-types';
import { catchError, throwError } from 'rxjs';

import { CustomHttpErrorResponse } from '../interfaces/error.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catchError((error: CustomHttpErrorResponse<SharedApiErrorInterface<any>>) => {
      const customError = new CustomHttpErrorResponse({
        ...error,
        error: error.error, // Устанавливаем конкретный тип ошибки, если нужно
      });
      handleHttpError(customError, snackBar);
      console.error('Custom Error:', customError);
      return throwError(() => customError); // Передаем ошибку дальше
    }),
  );
};

function handleHttpError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: CustomHttpErrorResponse<SharedApiErrorInterface<any>>,
  snackBar: MatSnackBar,
) {
  if (error.error instanceof ErrorEvent) {
    // Ошибка на стороне клиента
    console.error('Client-side error:', error.error.message);
    snackBar.open('Произошла ошибка на клиенте', 'Закрыть', { duration: 5000 });
  } else {
    // Ошибка на стороне сервера
    console.error(`Server-side error: ${error.error.code} - ${error.message}`);
    const message =
      error.status === 0 ? 'Не удалось соединиться с сервером.' : `Ошибка ${error.status}: ${error.message}`;
    snackBar.open(message, 'Закрыть', { duration: 5000 });
  }
}
