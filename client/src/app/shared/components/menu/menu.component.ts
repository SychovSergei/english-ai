import { Component, Input, OnInit } from '@angular/core';
import { Config, MenuItem } from './menu.interfaces';
import { MatIcon } from '@angular/material/icon';
import { Route, Router, RouterLink, RouterLinkActive, Routes } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    NgForOf,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  config: Config = { multi: true };
  @Input() options = {};
  @Input() menuItems: MenuItem[] = [];

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.config = this.mergeConfig(this.options);
  }

  private mergeConfig(options: Config) {
    const config = {
      multi: true
    };
    return { ...config, ...options };
  }

  navigateTo(route: string | undefined): void {
    if (route) {
      if (this.hasRoute(route, this.router.config)) {
        this.router.navigate([route]);
      } else {
        console.error(`Route '${route}' doesn't exist!`);
      }
    }
  }

  private hasRoute(routePath: string, routes: Route[]): boolean {
    const allRoutes = this.getRoutes(routes);
    const setRoutes = new Set(allRoutes);
    const filterRoute = routePath.split("/").filter(item => item.trim().length > 0).join("/");

    return setRoutes.has(filterRoute);
  }

  private getRoutes(routes: Routes): string[] {
    const routePaths: string[] = [];
    routes.forEach(route => {
      if (route.path) {
        routePaths.push(route.path);
      }
      if (route.children) {
        const childPaths = this.getRoutes(route.children);
        routePaths.push(...childPaths.map(childPath => `${route.path}/${childPath}`));
      }
    });
    return routePaths;
  }

  toggle(index: number) {
    // submenu
    if (!this.config.multi) {
      this.menuItems.filter(
        (menu, i) => i !== index && menu.active
      ).forEach(menu => menu.active = !menu.active);
    }

    // Menu active
    this.menuItems[index].active = !this.menuItems[index].active;
  }

}
