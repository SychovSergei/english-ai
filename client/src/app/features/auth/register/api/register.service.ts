import { AuthApiService, IUserRegisterDTO, IUserRegisterResponse } from '@shared/api';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private router: Router,
    private authApi: AuthApiService,
  ) {}

  registration(userData: IUserRegisterDTO): Observable<IUserRegisterResponse> {
    return this.authApi.register(userData).pipe(
      tap((result) =>
        this.router.navigate(['/auth/success-register'], {
          queryParams: {
            email: result.email,
            name: result.name,
            firstName: result.name.firstName,
            lastName: result.name.lastName,
          },
        }),
      ),
    );
    // this.http.post<UserRegistrationResponse>(this.registrationUrl, userData);
  }
}
