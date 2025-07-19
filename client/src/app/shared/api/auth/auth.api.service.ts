// import { environment } from '@environments/environment';
import { IUserLoginDTO, IUserLoginResponse, IUserRegisterDTO, IUserRegisterResponse } from '@shared/api/types/auth.dto';
import { HttpApiService } from '@shared/infrastructure';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  // private readonly apiDomain = environment.apiDomain; // TODO через токен ??
  private readonly registrationUrl: string = `api/auth/registration`;
  private readonly loginUrl: string = `api/auth/login`;
  private readonly logoutUrl: string = `api/auth/logout`;

  constructor(private httpService: HttpApiService) {}

  register(userData: IUserRegisterDTO): Observable<IUserRegisterResponse> {
    return this.httpService.post<IUserRegisterResponse, IUserRegisterDTO>(this.registrationUrl, userData);
  }

  login(userData: IUserLoginDTO): Observable<IUserLoginResponse> {
    return this.httpService.post<IUserLoginResponse, IUserLoginDTO>(this.loginUrl, userData);
  }

  logout(): Observable<void> {
    return this.httpService.post<void, unknown>(this.logoutUrl, {});
  }
}
