import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError, BehaviorSubject, switchMap, catchError } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';

export const authInterceptor_____: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Observable<any> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let isRefreshed = false;
  const refreshTokenSubject = new BehaviorSubject<string | null>(null);

  const addTokenToRequest = (request: HttpRequest<unknown>, token: string | null) => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleTokenRefresh = (request: HttpRequest<unknown>, handler: HttpHandlerFn) => {
    if (!isRefreshed) {
      isRefreshed = true;
      refreshTokenSubject.next(null);

      return authService.refresh().pipe(
        switchMap(({ accessToken }) => {
          isRefreshed = false;
          refreshTokenSubject.next(accessToken);
          authService.setAccessToken(accessToken);

          const updatedRequest = addTokenToRequest(request, accessToken);
          return handler(updatedRequest); // Вызов handler
        }),
        catchError((refreshError) => {
          console.error('Error refreshing token:', refreshError);
          router.navigate(['/auth/login']);
          return throwError(refreshError);
        }),
      );
    } else {
      return refreshTokenSubject.pipe(
        switchMap((newToken) => {
          const updatedRequest = addTokenToRequest(request, newToken);
          return handler(updatedRequest); // Вызов handler
        }),
      );
    }
  };

  const accessToken = authService.getAccessToken();
  const modifiedReq = addTokenToRequest(req, accessToken);

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleTokenRefresh(req, next);
      }
      return throwError(error);
    }),
  );
};
