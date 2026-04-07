import { AuthService } from '@entities/session/api/auth.service';
import { TokenService } from '@shared/api/auth';

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { FingerprintService } from '@shared/api/auth/fingerprint.service';

export const authInitialiseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const loggerService = inject(LoggerService);
  const fpService = inject(FingerprintService);

  const token = tokenService.getAccessToken();
  const fp = fpService.visitorId() ?? '';

  loggerService.log('[authInitialiseInterceptor]: token =', token);
  if (token) loggerService.log('[authInitialiseInterceptor]: token Expire In =', tokenService.tokenWillExpireIn(token));

  // Простая проверка: если токен есть, проверяем его срок годности (библиотека jwt-decode)
  if (token && tokenService.isTokenExpired(token)) {
    loggerService.warn('[authInitialiseInterceptor]: TODO CHECK THIS - Access token expired. Cleaning up...');
    // authService
    //   .refreshTokens()
    //   .pipe()
    //   .subscribe((newAccessToken) => {
    //     console.log('[authInitialiseInterceptor]: New access token =', newAccessToken);
    //     tokenService.setAccessToken(newAccessToken);
    //   });

    // localStorage.removeItem('accessToken'); // Удаляем мусор
    // Здесь можно вызвать logout или попробовать refresh
    // return next(req); // Продолжаем запрос уже без токена (как гость)
  }

  // let headers = req.headers;
  // if (token) headers = headers.set('Authorization', `Bearer ${token}`);
  // if (fp) headers = headers.set('X-Fingerprint', fp);
  // console.log('[authInitialiseInterceptor]: headers =', JSON.stringify(headers, null, 2));

  // Создаём модифицированный запрос с токеном
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'X-Fingerprint': fp,
    },
    withCredentials: true, // ОБЯЗАТЕЛЬНО для передачи кук (guestId, refreshToken)
  });

  // Передаём запрос дальше по цепочке интерсепторов
  return next(authReq);
  // .pipe(
  //   catchError((error: HttpErrorResponse) => {
  //     if (error.status === 401) {
  //       console.warn('[authInitialiseInterceptor]: RESPONSE ERROR 401:', error);
  //       // localStorage.removeItem('accessToken'); // Удаляем мусор
  //       // inject(Router).navigate(['/login']);
  //     }
  //     return throwError(() => error);
  //   }),
  // );
};
