import { LoginService } from '@features/auth';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * CCCCCCCCCC
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: LoginService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('CLIENT AUTH GUARD');
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.authService.redirectUrl = state.url;
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
