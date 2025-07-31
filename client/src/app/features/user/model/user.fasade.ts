import { IUser as User } from '@entities/user';
import { UserService } from '@features/user/model/user.service';

import { Injectable } from '@angular/core';

// TODO check if needed
@Injectable({ providedIn: 'root' })
export class UserFacade {
  constructor(private userService: UserService) {}

  get user(): User | null {
    return this.userService.userData();
  }

  initUser(): void {
    this.userService.loadUserInfo().subscribe();
  }

  refreshUserFromToken(): void {
    this.userService.loadUserFromToken();
  }

  getCurrentUser(): User | null {
    return this.userService.getCurrentUser();
  }
}
