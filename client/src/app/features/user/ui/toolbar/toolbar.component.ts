import { IUser } from '@entities/user';
import { LoginService } from '@features/auth';
import { UserService } from '@features/user/model/user.service';
import { UserSettingsService } from '@features/user-settings/user-settings.service';
import { BreakpointService } from '@shared/infrastructure';
import { EBreakpoints } from '@shared/infrastructure/ui/breakpoint.service';
import { UserSettings } from '@shared/interfaces/user-settings.interface';
import { UiKitModule } from '@shared/ui/ui-kit';

import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [UiKitModule, NgIf, AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  userInfo$: Observable<IUser | null> = of(null);
  userSettings: UserSettings | null = null;
  userSettingsService = inject(UserSettingsService);

  isOver600px: boolean = true;
  isOver600pxSubscription!: Subscription;

  @Output() topbarMenuClick: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public breakpointService: BreakpointService,
    public loginService: LoginService,
    public userService: UserService,
    public router: Router,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isOver600pxSubscription = this.breakpointService.getBreakpointState(EBreakpoints.Min600).subscribe((res) => {
      this.isOver600px = res;
    });

    this.userInfo$ = this.userService.user$.pipe(
      tap((user) => {
        console.log('tool user info', user);
        this.userSettings = user?.['settings'] as unknown as UserSettings;
        this.cdRef.detectChanges();
      }),
    );
  }

  ngOnDestroy(): void {
    this.isOver600pxSubscription.unsubscribe();
  }

  menuClick(): void {
    this.topbarMenuClick.emit();
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        // console.log('toolbar logout >>>');
        // Очищаем состояние приложения и редиректим
        // this.router.navigate(['/auth/login']); //вся логика в сервисе
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }
}
