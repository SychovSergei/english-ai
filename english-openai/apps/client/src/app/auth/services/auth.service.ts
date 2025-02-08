import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
// import { IAuthLogin } from '../interfaces--/auth.interface';
// import { IUserDto, IUserRespond } from '../interfaces--/user.dto';
// import { IUserLoginDto } from '../interfaces--/user.interface';
import { UserLogin, UserRegistration, UserRegistrationResponse } from '../../core/interfaces/user.interface';

export interface Tokens {
  // TODO replace to somewhere )))))
  accessToken: string;
  refreshToken: string;
}
export type LoginResponse = Pick<Tokens, 'accessToken'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUrl: string | null = null;
  private readonly apiDomain = environment.apiDomain;
  private readonly registrationUrl: string = `${this.apiDomain}/api/auth/registration`;
  private readonly loginUrl: string = `${this.apiDomain}/api/auth/login`;
  private readonly logoutUrl: string = `${this.apiDomain}/api/auth/logout`;
  // private readonly loginFacebookUrl: string = `${this.apiDomain}/api/auth/facebook`;
  // private readonly loginInstagramUrl: string = `${this.apiDomain}/api/auth/instagram`;
  private readonly refreshTokenUrl: string = `${this.apiDomain}/api/auth/refresh`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  isAuthenticated() {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      return this.tokenService.checkTokenValidity(accessToken);
    }
    return false;
  }

  registration(userData: UserRegistration): Observable<UserRegistrationResponse> {
    return this.http.post<UserRegistrationResponse>(this.registrationUrl, userData);
  }

  login(userData: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, userData);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.logoutUrl, {});
  }

  // TODO delete method???
  clearUserData() {
    // Удаляем токены из хранилищ
    localStorage.removeItem('accessToken');

    // Отправить запрос на сервер для уничтожения сессии
    this.http.post('/api/auth/logout', {}).subscribe({
      next: () => console.log('Сессия удалена на сервере'),
      error: (err) => console.warn('Ошибка удаления сессии на сервере', err),
    });
  }

  // loginWithFacebook() {
  //   window.location.href = this.loginFacebookUrl;
  //   // return this.http.post<IAuthLogin>(this.loginUrl, userData, {
  //   //   withCredentials: true, // allows sending cookies
  //   // });
  // }
  //
  // loginWithInstagram() {
  //   window.location.href = this.loginInstagramUrl;
  //   // return this.http.post<IAuthLogin>(this.loginUrl, userData, {
  //   //   withCredentials: true, // allows sending cookies
  //   // });
  // }

  // refresh(): Observable<IUserRespond<IUserDto>> {
  //   return this.http.get<IUserRespond<IUserDto>>(this.refreshTokenUrl);
  // }
  refresh(): Observable<Tokens> {
    return this.http.get<Tokens>(this.refreshTokenUrl);
  }

  //TODO replace to local storage service
  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  removeAccessToken() {
    localStorage.removeItem('accessToken');
  }

  //TODO replace to local storage service
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
}
