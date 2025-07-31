import { LoginService } from '@features/auth';
import { TokenService } from '@shared/infrastructure';
import { CustomHttpErrorResponse } from '@shared/interfaces/error.interface';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

// Функциональный интерсептор для работы с токенами
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const loginService = inject(LoginService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Флаг для предотвращения одновременного обновления токена
  let isRefreshed = false;

  // Объект для отслеживания обновлённого токена
  // const refreshTokenSubject = new BehaviorSubject<string | null>(null);

  /**
   * Функция добавления токена в заголовок запроса.
   * @param request Исходный запрос
   * @param token Токен доступа
   * @returns Запрос с добавленным заголовком Authorization
   */
  const addTokenToRequest = (request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  };

  /**
   * Обработчик обновления токена.
   * Выполняется, если сервер возвращает ошибку 401.
   * @param request Исходный запрос
   * @param handler Функция для передачи запроса
   * @returns Observable с результатом повторного запроса или ошибкой
   */
  const handleTokenRefresh = (
    request: HttpRequest<unknown>,
    handler: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> => {
    console.log('handleTokenRefresh isRefreshed', isRefreshed);
    if (!isRefreshed) {
      isRefreshed = true; // Устанавливаем флаг, что обновление началось
      // refreshTokenSubject.next(null); // Сбрасываем значение токена

      return tokenService.refresh().pipe(
        switchMap(({ accessToken }) => {
          // Если обновление токена успешно
          isRefreshed = false; // Сбрасываем флаг
          tokenService.setAccessToken(accessToken); // Сохраняем токен в сервисе
          const updatedRequest = addTokenToRequest(request, accessToken);
          return handler(updatedRequest); // Передаём обновлённый запрос дальше
        }),
        catchError((refreshError) => {
          // Обработка ошибки обновления токена
          router.navigate(['/auth/login']);
          return throwError(refreshError); // Возвращаем ошибку
        }),
      );
    }
    return throwError(() => new Error('Token refresh already in progress'));
  };

  /**
   * Обработчик удаления токенов и завершения сессии.
   * Выполняется, если сервер возвращает ошибку invalid_refresh_token.
   * @returns Observable с ошибкой после очистки токенов и перенаправления
   */
  // const handleTokenDelete = (): Observable<never> => {
  //   // Очищаем localStorage и куки
  //
  //   document.cookie = 'refreshToken=; max-age=0; path=/;'; // Удаление куки
  //
  //   // Вызываем logout, если он есть
  //   loginService.logout().subscribe({
  //     next: () => {
  //       tokenService.removeAccessToken();
  //       // Перенаправляем пользователя на страницу авторизации
  //       router.navigate(['/auth/login']);
  //     },
  //   });
  //
  //   // Возвращаем Observable с ошибкой
  //   return throwError(() => new Error('Токен недействителен. Пользователь вышел из системы.'));
  // };
  const handleTokenDelete = (): Observable<never> => {
    // Вызываем logout на сервере, который сам очистит refreshToken куку
    return loginService.logout().pipe(
      tap(() => {
        // Локально очищаем accessToken и редиректим
        tokenService.removeAccessToken();
        router.navigate(['/auth/login']);
      }),
      switchMap(() => throwError(() => new Error('Токен недействителен. Пользователь вышел из системы.'))),
    );
  };

  const accessToken = tokenService.getAccessToken();
  // Создаём модифицированный запрос с токеном
  const modifiedReq: HttpRequest<unknown> = addTokenToRequest(req, accessToken);

  // Передаём запрос дальше по цепочке интерсепторов
  return next(modifiedReq).pipe(
    // tap(() => {}),
    catchError((error) => {
      // if (error instanceof HttpErrorResponse) {
      if (error instanceof CustomHttpErrorResponse) {
        if (error.status === 401 && error.error.code === 'auth/invalid_access_token') {
          return handleTokenRefresh(req, next);
        }
        if (error.status === 401 && error.error.code === 'auth/invalid_refresh_token') {
          return handleTokenDelete();
        }
      }
      return throwError(() => error); // Передаём ошибку дальше
    }),
  );
};
