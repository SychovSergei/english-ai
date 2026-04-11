import {
  AuthData,
  AuthInitData,
  LoginPayload,
  RegisterPayload,
  RegisterResponseDto,
  TokenService,
} from '@entities/session';
import { HttpApiService } from '@shared/api';

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, retry, share, take, tap, throwError, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpService = inject(HttpApiService);
  private readonly tokenService = inject(TokenService);
  private readonly API_URL = 'api/auth';

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  public refreshToken$ = this.refreshTokenSubject.asObservable(); //.pipe(share());

  constructor() {}

  refreshTokens(): Observable<string> {
    // if refresh is in progress -> new request is not created
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((resp) => resp !== null),
        take(1),
        map((token) => token),
      );
    }

    // Ставим замок
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null); // Сбрасываем старое значение

    return this.httpService.post<AuthData>(`${this.API_URL}/refresh`, {}).pipe(
      retry({
        count: 3,
        delay: (error) => {
          // if this is network error (status === 0), retry after 2 seconds
          if (error.status === 0) return timer(2000);
          // if this real server error, throw it further (not retry)
          return throwError(() => error);
        },
      }),
      tap((res) => {
        this.isRefreshing = false;
        this.tokenService.setAccessToken(res.accessToken);
        // Рассылаем новый токен всем, кто "стоит в очереди"
        this.refreshTokenSubject.next(res.accessToken);
      }),
      map((res) => res.accessToken),
      catchError((err) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.tokenService.clearAccessToken(); // Если даже рефреш не удался — всё, на выход

        // Important: Logout only if server says "401".
        if (err.status !== 0) this.logout();
        return throwError(() => err);
      }),
      // share() гарантирует, что если в этот микро-момент кто-то еще
      // вызовет этот метод, он подпишется на тот же самый запрос
      share(),
    );
  }

  // for APP_INITIALIZER (using now)
  initSession(fingerprint: string): Observable<AuthInitData> {
    return this.httpService.post<AuthInitData, string>(`${this.API_URL}/init`, fingerprint);
  }

  /** register(userData: IUserRegisterDTO): Observable<IUserRegisterResponse> {*/
  register(dto: RegisterPayload): Observable<RegisterResponseDto> {
    /** return this.httpService.post<IUserRegisterResponse, IUserRegisterDTO>(`${this.API_URL}/registration`, userData);*/
    return this.httpService.post<RegisterResponseDto, RegisterPayload>(`${this.API_URL}/register`, dto);
  }

  /** login(userData: IUserLoginDTO): Observable<IUserLoginResponse> {*/
  login(dto: LoginPayload): Observable<AuthData> {
    /** return this.httpService.post<SessionResponse, IUserLoginDTO>(`${this.API_URL}/login`, userData);*/
    return this.httpService.post<AuthData, LoginPayload>(`${this.API_URL}/login`, dto);
  }

  logout(): Observable<void> {
    return this.httpService.post<void>(`${this.API_URL}/logout`, {});
  }
}
