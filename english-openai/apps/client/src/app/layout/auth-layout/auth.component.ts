import { Component } from '@angular/core';
import { Router, RouterOutlet, Routes } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
})
export class AuthComponent {
  routes: Routes;

  constructor(private router: Router) {
    this.routes = router.config;
  }
}
