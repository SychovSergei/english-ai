import { IUser as User } from '@entities/user';
import { UserApi } from '@features/user/api/user.api';
import { TokenService } from '@shared/infrastructure';

import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #userData: WritableSignal<User | null> = signal<User | null>(null);
  readonly userData: Signal<User | null> = this.#userData.asReadonly();

  constructor(
    private userApi: UserApi, // TODO replace with inject function
    private tokenService: TokenService,
  ) {}

  loadUserInfo(): Observable<User | null> {
    //TODO надо доработать (если планируется получение настроек отдельно)
    // TODO обработка ошибок
    return this.userApi.getUserInfo().pipe(
      tap((user) => {
        this.#userData.set(user);
      }),
      catchError((err) => {
        console.error('[UserService] Failed to load user info:', err);
        return of(null); // Возврат пустых настроек, чтобы приложение продолжило работать
      }),
    );
  }

  loadUserFromToken(): Observable<User | null> {
    return this.tokenService.getUserDataFromToken().pipe(tap((user) => this.#userData.set(user)));
  }

  getCurrentUser(): User | null {
    return this.userData();
  }
}
