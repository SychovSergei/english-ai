import { SessionFacade } from '@entities/session';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * CCCCCCCCCC
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private loggerService = inject(LoggerService).createLogger('AuthGuard');

  constructor(
    private sessionFacade: SessionFacade,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loggerService.log('CLIENT AUTH GUARD');
    if (this.sessionFacade.snapshot?.kind === 'user') {
      return true;
    } else {
      this.sessionFacade.redirectUrl = state.url;
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
