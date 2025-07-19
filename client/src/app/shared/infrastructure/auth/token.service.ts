import { IUserTokenPayload } from '@shared/api';
import { HttpApiService } from '@shared/infrastructure';
import { jwtDecode } from 'jwt-decode';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

interface ITokenInfo {
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly refreshTokenUrl: string = `api/auth/refresh`;

  constructor(private httpService: HttpApiService) {}

  getUserDataFromToken(): Observable<IUserTokenPayload | null> {
    let decodedToken: IUserTokenPayload | null = null;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      decodedToken = JSON.parse(JSON.stringify(jwtDecode(accessToken)));
    }
    return of(decodedToken);
  }

  checkTokenValidity(token: string): boolean {
    const { exp } = jwtDecode<ITokenInfo>(token);
    const expDate = exp * 1000;
    const now = new Date().getTime();

    return expDate > now;
  }

  refresh(): Observable<ITokens> {
    return this.httpService.get<ITokens>(this.refreshTokenUrl);
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
