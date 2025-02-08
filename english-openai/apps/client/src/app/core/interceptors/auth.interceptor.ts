import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { CustomHttpErrorResponse } from '../interfaces/error.interface';
// import { SharedApiErrorInterface } from '@shared/errors/error-types';

// Функциональный интерсептор для работы с токенами
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const authService = inject(AuthService);
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
  const addTokenToRequest = (request: HttpRequest<unknown>, token: string | null) => {
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
  const handleTokenRefresh = (request: HttpRequest<unknown>, handler: HttpHandlerFn) => {
    if (!isRefreshed) {
      isRefreshed = true; // Устанавливаем флаг, что обновление началось
      // refreshTokenSubject.next(null); // Сбрасываем значение токена

      return authService.refresh().pipe(
        switchMap(({ accessToken }) => {
          // Если обновление токена успешно
          isRefreshed = false; // Сбрасываем флаг
          authService.setAccessToken(accessToken); // Сохраняем токен в сервисе
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
  const handleTokenDelete = (): Observable<never> => {
    // Очищаем localStorage и куки
    authService.removeAccessToken();
    document.cookie = 'refreshToken=; Max-Age=0; path=/;'; // Удаление куки

    // Вызываем logout, если он есть
    authService.logout().subscribe({
      next: () => {
        // Перенаправляем пользователя на страницу авторизации
        router.navigate(['/auth/login']);
      },
    });

    // Возвращаем Observable с ошибкой
    return throwError(() => new Error('Токен недействителен. Пользователь вышел из системы.'));
  };

  const accessToken = authService.getAccessToken();
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
      return throwError(error); // Передаём ошибку дальше
    }),
  );
};
