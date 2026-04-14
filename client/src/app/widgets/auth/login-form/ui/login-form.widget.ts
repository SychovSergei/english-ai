import { AuthByEmailFormComponent, SocialAuthComponent, ToLoginComponent, ToRegisterComponent } from '@features/auth';
import { UiKitModule } from '@shared/ui/ui-kit';

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-login-form-widget',
  templateUrl: './login-form.widget.html',
  styleUrls: ['./login-form.widget.scss'],
  standalone: true,
  imports: [
    UiKitModule,
    MatCardModule,
    AuthByEmailFormComponent,
    MatDivider,
    SocialAuthComponent,
    ToLoginComponent,
    ToRegisterComponent,
  ],
})
export class LoginFormWidget {
  constructor() {
    console.log('LoginFormWidget constructor');
  }
}
