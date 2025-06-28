import { IUser } from '@entities/user';
import { UserService } from '@features/user/model/user.service';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  constructor(private userService: UserService) {}

  get user$(): Observable<IUser | null> {
    return this.userService.user$;
  }

  initUser(): void {
    this.userService.loadUserInfo().subscribe();
  }

  refreshUserFromToken(): void {
    this.userService.loadUserFromToken();
  }

  getCurrentUser(): IUser | null {
    return this.userService.getCurrentUser();
  }
}
