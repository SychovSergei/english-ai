import { LoginService } from '@features/auth';

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionFacade } from '@entities/session/model/session.facade';
import { LoggerService } from '@shared/lib/logger/logger.service';

/**
 * CCCCCCCCCC
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private loggerService = inject(LoggerService);

  constructor(
    private authService: LoginService,
    private sessionFacade: SessionFacade,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loggerService.log('CLIENT AUTH GUARD');
    // TODO replace authService.isAuthenticated with other method!!!
    // if (this.authService.isAuthenticated()) {
    if (this.sessionFacade.snapshot?.kind === 'user') {
      return true;
    } else {
      this.sessionFacade.redirectUrl = state.url;
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
