import { LoginService } from '@features/auth';
import { LoginDialogComponent } from '@features/auth/login-dialog/login-dialog.component';
import { UserService } from '@features/user/model/user.service';
import { ToolbarComponent } from '@features/user/ui';
import { SwipeDirective } from '@shared/directives';
import { BreakpointService } from '@shared/infrastructure';
import { EBreakpoints } from '@shared/infrastructure/ui/breakpoint.service';
import { ConfirmDialogComponent, FooterComponent } from '@shared/ui';
import { Config, MenuComponent, MenuItem } from '@widgets/menu';

import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawerContent,
    RouterOutlet,
    MatDrawer,
    FooterComponent,
    ToolbarComponent,
    MenuComponent,
    SwipeDirective,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  isMobile: boolean = false;

  options: Config = {
    multi: false,
  };

  menus: MenuItem[] = [
    {
      title: 'Dashboard',
      iconSource: {
        type: 'mat-icon',
        matIconData: {
          iconCode: 'dashboard',
        },
      },
      url: '/main/dashboard',
      active: false,
    },
    {
      title: 'Words',
      iconSource: {
        type: 'mat-icon',
        matIconData: {
          iconCode: 'dashboard',
        },
      },
      // url: '/words',
      active: false,
      submenu: [
        { title: 'My Words', url: '/words/my-words' },
        { title: 'Create Word Sets', url: '/words/word-set/create' },
        { title: 'Edit Word Sets', url: '/words/word-set/edit/123456' }, // TODO MENU ID
        // { title: 'Add Word/Sets', url: '/words/manage' },
      ],
    },
    // {
    //   title: 'Word Groups',
    //   iconSource: {
    //     type: 'mat-icon',
    //     matIconData: {
    //       iconCode: 'dashboard',
    //     },
    //   },
    //   url: '/word-sets',
    //   active: false,
    // },

    {
      title: 'Auth',
      iconSource: {
        type: 'mat-icon', //type: "fontawesome",
        matIconData: {
          iconCode: 'dashboard', //iconClass: 'fa fa-mobile',
        },
      },
      active: false,
      submenu: [
        { title: 'Login', url: '/auth/login' },
        { title: 'Register', url: '/auth/register' },
      ],
    },
  ];

  constructor(
    public breakpointService: BreakpointService,
    public dialog: MatDialog,
    public loginService: LoginService,
    public userService: UserService,
  ) {
    this.breakpointService.getBreakpointState(EBreakpoints.XSmall)?.subscribe((res) => {
      this.isMobile = res;
    });
  }

  onSwipe(event: 'left' | 'right' | 'up' | 'down'): void {
    console.log(event);
    if (event === 'left') {
      this.drawer.close();
    }
  }

  onLoggedIn(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      panelClass: 'fullscreen-dialog',
      maxWidth: '100vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Диалог закрылся с результатом:', result);

      if (result?.success) {
        this.userService.loadUserFromToken().subscribe();
      }
    });
  }

  onLoggedOut(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Logout',
        message: 'Are you sure you want to log out?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loginService.logout().subscribe({
          next: () => {
            console.log('Logout successful');
            this.userService.loadUserFromToken().subscribe();
          },
          error: (error) => {
            console.error('Logout error:', error);
          },
        });
      }
    });
  }
}
