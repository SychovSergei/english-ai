import { AuthService } from '@entities/session/api/auth.service';

import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '@shared/lib/logger/logger.service';

/**
 * Интерсептор для обновления токена аутентификации.
 * Проверяет статус ответа и обновляет токен, если он истек (401).
 * Если обновление токена успешно, повторяет исходный запрос с новым токеном.
 * Если обновление токена не удалось, выполняет выход пользователя.
 */
export const refreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  // Извлекаем сервис аутентификации для обновления токена.
  const authService = inject(AuthService);
  const loggerService = inject(LoggerService);

  // Логируем URL запроса для отладки.
  loggerService.log('[refreshInterceptor] Request URL:', req.url.toString());

  // Передаем запрос дальше по цепочке интерсепторов.
  loggerService.log('[refreshInterceptor] URL', req.url.toString());
  // Передаём запрос дальше по цепочке интерсепторов
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Проверяем, что это 401 и это НЕ запрос на сам refresh
      loggerService.log('[refreshInterceptor]: error.status =====', error.status);
      loggerService.log('?????[refreshInterceptor]: req.url =====', req.url);
      if (error.status === 401 && !req.url.includes('auth/refresh')) {
        //&& !req.url.includes('auth/login') && !req.url.includes('auth/refresh')
        loggerService.warn('?????[refreshInterceptor]: Refresh token process ./././');
        return authService.refreshTokens().pipe(
          switchMap((newToken) => {
            loggerService.log('[refreshInterceptor]: Refresh NEW token', newToken);
            // Repeat the request with the new access token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true, // ОБЯЗАТЕЛЬНО для передачи кук (guestId, refreshToken)
            });
            // Repeat the request
            return next(retryReq);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            // If refresh token fails (session is deleted from database), logout
            // authService.logout();
            return throwError(() => refreshError);
          }),
        );
      }

      // Если это не 401, просто прокидываем ошибку дальше в errorInterceptor
      return throwError(() => error);
    }),
  );
};
