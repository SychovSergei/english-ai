import { FooterComponent } from '@shared/ui/footer/footer.component';

import { Component } from '@angular/core';
import { Router, RouterOutlet, Routes } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
})
export class AuthLayoutComponent {
  routes: Routes;

  constructor(private router: Router) {
    this.routes = router.config;
  }
}
