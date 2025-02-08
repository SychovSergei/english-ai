import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { Observable, of, Subscription, tap } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { UserSettings } from '../../../core/interfaces/user-settings.interface';
import { User } from '../../../core/interfaces/user.interface';
import { BreakpointService, EBreakpoints } from '../../../core/services/breakpoint.service';
import { UserSettingsService } from '../../../core/services/user-settings.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatIconButton, NgIf, AsyncPipe, MatTooltip],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  userInfo$: Observable<User | null> = of(null);
  userSettings: UserSettings | null = null;
  userSettingsService = inject(UserSettingsService);

  isOver600px: boolean = true;
  isOver600pxSubscription!: Subscription;

  @Output() topbarMenuClick: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public breakpointService: BreakpointService,
    public authService: AuthService,
    public userService: UserService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.isOver600pxSubscription = this.breakpointService.getBreakpointState(EBreakpoints.Min600).subscribe((res) => {
      this.isOver600px = res;
    });

    this.userInfo$ = this.userService.userInfo$.pipe(
      tap((user) => {
        console.log('tool user info', user);
        this.userSettings = user?.settings as unknown as UserSettings;
      }),
    );
  }

  ngOnDestroy() {
    this.isOver600pxSubscription.unsubscribe();
  }

  menuClick() {
    this.topbarMenuClick.emit();
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        console.log('toolbar logout >>>');
        // Удаляем токены из хранилища
        this.authService.removeAccessToken(); //localStorage.removeItem('accessToken');
        // Очищаем состояние приложения и редиректим
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }
}
