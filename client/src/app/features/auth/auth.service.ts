// import { UserLogin, UserRegistration, UserRegistrationResponse } from '@core/interfaces/user.interface';
import { AuthApiService } from '@shared/api';
import { TokenService } from '@shared/infrastructure';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// TODO лишний класс -> удалить ????
@Injectable({
  providedIn: 'root',
})
// export class AuthService {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AuthService {
  redirectUrl: string | null = null;

  // private readonly logoutUrl: string = `${this.apiDomain}/api/auth/logout`;
  // private readonly loginFacebookUrl: string = `${this.apiDomain}/api/auth/facebook`;
  // private readonly loginInstagramUrl: string = `${this.apiDomain}/api/auth/instagram`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private authApi: AuthApiService,
  ) {}

  // registration(userData: UserRegistration): Observable<UserRegistrationResponse> {

  // TODO delete method???
  clearUserData(): void {
    // Удаляем токены из хранилищ
    localStorage.removeItem('accessToken');

    // Отправить запрос на сервер для уничтожения сессии
    this.http.post('api/auth/logout', {}).subscribe({
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

  //TODO replace to local storage service

  //TODO replace to local storage service
}
