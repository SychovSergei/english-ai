import { IUser } from '@entities/user';
import { UserApi } from '@features/user/api/user.api';
import { TokenService } from '@shared/infrastructure';

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private userApi: UserApi,
    private tokenService: TokenService,
  ) {}

  // getUserInfo(): Observable<User | null> {}
  loadUserInfo(): Observable<IUser | null> {
    //TODO надо доработать (если планируется получение настроек отдельно)
    // TODO обработка ошибок
    return this.userApi.getUserInfo().pipe(
      tap((user) => this.userSubject.next(user)),
      catchError((err) => {
        console.error('[UserService] Failed to load user info:', err);
        return of(null); // Возврат пустых настроек, чтобы приложение продолжило работать
      }),
    );
  }

  // getCurrentUserInfo() {}
  loadUserFromToken(): void {
    this.tokenService.getUserDataFromToken().subscribe((user) => {
      // TODO подписки в сервисе не должно быть
      this.userSubject.next(user);
    });
  }

  getCurrentUser(): IUser | null {
    return this.userSubject.value;
  }
}
