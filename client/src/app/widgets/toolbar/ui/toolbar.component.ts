import { SessionFacade } from '@entities/session';
import { UserEntity, UserFacade } from '@entities/user';
import { BreakpointService, EBreakpoints } from '@shared/services';
import { UiKitModule } from '@shared/ui';
import { AuthActionService } from '@widgets/auth';

import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  imports: [UiKitModule, NgIf, AsyncPipe, JsonPipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  standalone: true,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private readonly userFacade = inject(UserFacade);

  user$: Observable<UserEntity | null> = of(null);

  isOver600px: boolean = true;
  isOver600pxSubscription!: Subscription;

  @Output() topbarMenuClick: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public breakpointService: BreakpointService,
    public sessionFacade: SessionFacade,
    public authActionService: AuthActionService,
    // public userService: UserService,
    public router: Router,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isOver600pxSubscription = this.breakpointService.getBreakpointState(EBreakpoints.Min600).subscribe((res) => {
      this.isOver600px = res;
    });

    this.user$ = this.userFacade.currentUser$;
  }

  ngOnDestroy(): void {
    this.isOver600pxSubscription.unsubscribe();
  }

  menuClick(): void {
    this.topbarMenuClick.emit();
  }

  login(): void {
    // Login by dialog
    console.log('Login by dialog');
    this.authActionService.login();
  }

  logout(): void {
    this.sessionFacade.logout().catch((error: Error) => {
      console.error('Logout error:', error);
    });
  }
}
