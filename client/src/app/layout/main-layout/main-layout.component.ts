import { Component } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { Config, MenuItem } from '../../shared/components/menu/menu.interfaces';
import { BreakpointService, EBreakpoints } from '../../core/services/breakpoint.service';

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
    MenuComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isMobile: boolean = false;

  options: Config = {
    multi: false,
  };

  menus: MenuItem[] = [
    {
      title: "Dashboard",
      iconSource: {
        type: "mat-icon",
        matIconData: {
          iconCode: "dashboard",
        },
      },
      url: "/main/dashboard",
      active: false,
    },
    {
      title: "Words",
      iconSource: {
        type: "mat-icon",
        matIconData: {
          iconCode: "dashboard",
        },
      },
      url: "/words",
      active: false,
    },
    {
      title: "Word Groups",
      iconSource: {
        type: "mat-icon",
        matIconData: {
          iconCode: "dashboard",
        },
      },
      url: "/word-groups",
      active: false,
    },

    {
      title: "Auth",
      iconSource: {
        type: "mat-icon", //type: "fontawesome",
        matIconData: {
          iconCode: "dashboard", //iconClass: 'fa fa-mobile',
        },
      },
      active: false,
      submenu: [
        { title: "Login", url: "/auth/login" },
        { title: "Register", url: "/auth/register" },
      ],
    },
  ];

  constructor(public breakpointService: BreakpointService) {
    this.breakpointService.getBreakpointState(EBreakpoints.XSmall)?.subscribe((res) => {
      this.isMobile = res;
    });
  }
}
