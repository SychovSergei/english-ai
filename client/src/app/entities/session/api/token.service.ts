import { IUserTokenPayload } from '@entities/session';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { jwtDecode } from 'jwt-decode';

import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// TODO нужен ли?
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

// TODO может в отдельный файл? Но куда?
interface ITokenInfo {
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly loggerService = inject(LoggerService).createLogger('TokenService');

  constructor() {}

  getUserDataFromToken(): Observable<IUserTokenPayload | null> {
    let decodedToken: IUserTokenPayload | null = null;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      decodedToken = JSON.parse(JSON.stringify(jwtDecode(accessToken)));
    }
    return of(decodedToken);
  }

  isTokenExpired(token: string): boolean {
    try {
      // console.group('START');
      // console.log(token);
      // const decodedToken: ITokenInfo | null = JSON.parse(JSON.stringify(jwtDecode(token))) || null;
      const { exp } = jwtDecode<ITokenInfo>(token);
      // if (decodedToken) {
      const expDate = exp * 1000;
      const now = new Date().getTime();
      // console.log(expDate, now);
      // console.groupEnd();
      return expDate < now;
      // }
    } catch (e) {
      this.loggerService.log('e', e);
      return false;
    }
  }

  tokenWillExpireIn(token: string): number {
    try {
      const { exp } = jwtDecode<ITokenInfo>(token);
      const now = new Date().getTime();

      return Math.round((exp * 1000 - now) / 1000);
    } catch (e) {
      this.loggerService.log('e', e);
      return 0;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  removeAccessToken(): void {
    localStorage.removeItem('accessToken');
  }

  clearAccessToken(): void {
    localStorage.removeItem('accessToken');
  }

  // getInfoFromToken(token: string) {
  //   try {
  //     const decodedToken = JSON.parse(JSON.stringify(jwtDecode(token))) || null;
  //     console.log(decodedToken);
  //     return decodedToken;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  //
  //   return false;
  // }
}
