import { LoginFormWidget } from '@widgets/auth';

import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.scss',
  standalone: true,
  imports: [LoginFormWidget, MatCard, MatCardHeader, MatCardContent],
})
export class LoginPageComponent {
  constructor() {
    console.log('LoginPageComponent constructor');
  }
}
