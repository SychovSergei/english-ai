import { RegisterComponent, ToLoginComponent } from '@features/auth';

import { Component } from '@angular/core';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterComponent, ToLoginComponent],
  templateUrl: './register.page.component.html',
  styleUrl: './register.page.component.scss',
})
export class RegisterPageComponent {}
