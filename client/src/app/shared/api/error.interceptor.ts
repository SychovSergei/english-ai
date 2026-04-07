import { CustomHttpErrorResponse } from '@shared/errors';
import { ApiErrorInterface } from '@shared/errors/error-types';

import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: CustomHttpErrorResponse<ApiErrorInterface<unknown>>) => {
      // 1. Оборачиваем стандартную ошибку в типизированный класс
      const customError = new CustomHttpErrorResponse<ApiErrorInterface<unknown>>({
        error: error.error,
        status: error.status,
        statusText: error.statusText,
        url: error.url, // ?? undefined,
        headers: error.headers,
        name: error.name,
        message: error.message,
        ok: error.ok,
        type: error.type,
      });
      // const customError = new CustomHttpErrorResponse<ApiErrorInterface<unknown>>({
      //   ...error,
      //   error: error.error, // Устанавливаем конкретный тип ошибки, если нужно
      // });

      console.log('customError', customError);

      // 2. Если это 401, и мы здесь (значит refreshInterceptor не справился или его нет)
      if (customError.status === 401) {
        // Мы не показываем Snackbar здесь, если хотим, чтобы refreshInterceptor
        // сначала попробовал обновить токен.
        // Но если мы дошли СЮДА, значит это окончательный провал.
        snackBar.open('Сессия истекла, пожалуйста войдите снова', 'Ок');
        return throwError(() => customError);
      }

      // 3. Обрабатываем визуальное оповещение
      // Не показываем ошибки для "ожидаемых" бизнес-кейсов, если нужно
      handleHttpError(customError, snackBar);

      // console.error('Custom Error:', customError);

      // 4. Пробрасываем типизированную ошибку дальше в компоненты
      return throwError(() => customError); // Передаем ошибку дальше
    }),
  );
};

function handleHttpError(error: CustomHttpErrorResponse<ApiErrorInterface<unknown>>, snackBar: MatSnackBar): void {
  if (error.error instanceof ErrorEvent) {
    // Ошибка на стороне клиента
    console.error('Client-side error:', error.error.message);
    // snackBar.open('Произошла ошибка на клиенте', 'Закрыть', { duration: 5000 });
  } else {
    // Ошибка на стороне сервера
    console.error(`Server-side error: ${error.error.code} - ${error.message}`);
    const message =
      error.status === 0 ? 'Не удалось соединиться с сервером.' : `Ошибка ${error.status}: ${error.message}`;
    snackBar.open(message, 'Закрыть', { duration: 5000 });
  }
}
