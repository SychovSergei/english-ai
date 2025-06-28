import { AuthApiService } from '@shared/api';
import { IUserLoginDTO, IUserLoginResponse } from '@shared/api';
import { TokenService } from '@shared/services';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  redirectUrl: string | null = null;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authApi: AuthApiService,
  ) {}

  login(userData: IUserLoginDTO): Observable<IUserLoginResponse> {
    return this.authApi.login(userData).pipe(
      tap((result) => {
        this.tokenService.setAccessToken(result.accessToken);
        /** redirect to the link that was remembered when logout process executed.
         *  It is returning customer to the same link before logout process. */
        if (this.redirectUrl) {
          const redirectUrl = this.redirectUrl;
          this.redirectUrl = null;
          this.router.navigateByUrl(redirectUrl);
        } else {
          console.log(`this.router.navigate([['words', 'word-sets']])`);
          this.router.navigate(['words', 'word-set', 'create']); // TODO create default route token
        }
      }),
      catchError((error) => {
        console.error('Login error:', error); // TODO нужно ли разделять ошибки???
        return throwError(() => new Error('Login failed. Please try again.'));
      }),
    );
  }

  logout(): Observable<void> {
    return this.authApi.logout().pipe(
      tap(() => {
        this.tokenService.removeAccessToken();
        this.router.navigate(['auth', 'login']);
      }),
    );
  }

  isAuthenticated(): boolean {
    const accessToken = this.tokenService.getAccessToken();
    if (accessToken) {
      return this.tokenService.checkTokenValidity(accessToken);
    }
    return false;
  }
}
