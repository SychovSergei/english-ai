import { BreakpointService, EBreakpoints } from '@shared/services/breakpoint.service';
import { FooterComponent } from '@shared/ui/footer/footer.component';
import { Config, MenuComponent, MenuItem } from '@widgets/menu';
import { ToolbarComponent } from '@widgets/toolbar';

import { Component } from '@angular/core';
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
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
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
        { title: 'Word Sets', url: '/words/word-sets' },
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

  constructor(public breakpointService: BreakpointService) {
    this.breakpointService.getBreakpointState(EBreakpoints.XSmall)?.subscribe((res) => {
      this.isMobile = res;
    });
  }
}
