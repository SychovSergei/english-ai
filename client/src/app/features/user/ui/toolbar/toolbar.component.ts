import { IUser as User } from '@entities/user';
import { UserService } from '@features/user/model/user.service';
import { BreakpointService } from '@shared/infrastructure';
import { EBreakpoints } from '@shared/infrastructure/ui/breakpoint.service';
import { UserSettings } from '@shared/interfaces/user-settings.interface';
import { UiKitModule } from '@shared/ui/ui-kit';

import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Signal,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [UiKitModule, NgIf, AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isOver600px: boolean = true;
  isOver600pxSubscription!: Subscription;

  @Output() topbarMenuClicked: EventEmitter<boolean> = new EventEmitter();
  @Output() loggedIn: EventEmitter<void> = new EventEmitter();
  @Output() loggedOut: EventEmitter<void> = new EventEmitter();

  userInfo: Signal<User | null>;
  userSettings: Signal<UserSettings | undefined>;

  constructor(
    public breakpointService: BreakpointService,
    public userService: UserService,
  ) {
    this.userInfo = this.userService.userData;
    this.userSettings = computed(() => this.userService.userData()?.settings);
  }

  ngOnInit(): void {
    this.isOver600pxSubscription = this.breakpointService.getBreakpointState(EBreakpoints.Min600).subscribe((res) => {
      this.isOver600px = res;
    });
  }

  ngOnDestroy(): void {
    this.isOver600pxSubscription.unsubscribe();
  }

  menuClick(): void {
    this.topbarMenuClicked.emit();
  }

  logout(): void {
    this.loggedOut.emit();
  }

  login(): void {
    this.loggedIn.emit();
  }
}
