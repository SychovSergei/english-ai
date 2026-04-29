import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';
import { UiKitModule } from '@shared/ui/ui-kit';

import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-feature-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.scss'],
  standalone: true,
  imports: [UiKitModule, ReactiveFormsModule, CustomSpinnerDirective, NgIf],
})
export class SocialAuthComponent {
  loginWithFacebook(): void {
    /** // this.authService.loginWithFacebook();
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     this.fbService.login((response: any) => {
     console.log('RESPONSE', response);
     if (response.authResponse) {
     console.log('Welcome! Fetching your information....');
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     this.fbService.getProfile((profile: any) => {
     console.log('Good to see you, ' + profile.name + '.');
     });
     } else {
     console.log('user-model cancelled login or did not fully authorize.');
     }
     });
     */
  }

  loginWithInstagram(): void {
    /** this.authService.loginWithInstagram(); */
  }
}
