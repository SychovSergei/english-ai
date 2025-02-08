import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { UserLogin } from '../../../core/interfaces/user.interface';
import { ErrorMessageModule } from '../../../shared/components/error-message/error-message.module';
// import { IUserLoginDto } from '../../interfaces--/user.interface';
import { AuthService } from '../../services/auth.service';

/** import { FacebookSdkService } from '../../services/facebook-sdk.service'; */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatLabel,
    MatError,
    MatButton,
    ErrorMessageModule,
    NgIf,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmit: boolean = false;

  redirectUrl: string | null = null;

  errors: string[] = [];

  readonly dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    /** private fbService: FacebookSdkService, */
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.redirectUrl = this.authService.redirectUrl;

    this.loginForm = new FormGroup({
      email: new FormControl('sychov.sergei+student@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
    });

    this.closeAllDialogs();
  }

  closeAllDialogs() {
    this.dialog.closeAll();
  }

  login() {
    const user: UserLogin = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
    };
    this.isSubmit = true;
    this.errors = [];

    this.authService.login(user).subscribe({
      next: (result) => {
        console.log('result', result);
        this.isSubmit = false;
        this.authService.setAccessToken(result.accessToken);
        /** redirect to the link that was remembered when logout process executed.
         *  It is returning customer to the same link before logout process. */
        if (this.authService.redirectUrl) {
          const redirectUrl = this.authService.redirectUrl;
          this.authService.redirectUrl = null;
          this.router.navigateByUrl(redirectUrl);
        } else {
          console.log(`this.router.navigate(['words'])`);
          this.router.navigate(['words']);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log('ERROR>>ERROR>>');
        this.isSubmit = false;

        if (error.status === 0) {
          this.errors.push('Network error. Check your internet connection and try again.');
        }
        if (error.error.code === 'user/wrong-password') {
          // this.loginForm.controls["password"].setErrors({ wrongPassword: true })
          this.errors.push('Wrong password. Please try again.');
        }
        if (error.error.code === 'user/not-found') {
          // this.loginForm.controls["email"].setErrors({ wrongUserEmail: true })
          this.errors.push('Wrong email. User with this email does not exist.');
        }
        if (error.error.code === 'user/not-activated') {
          this.errors.push('User is not activated! Please check email and activate user.');
        }
        if (error.status == 504) {
          this.errors.push(
            `Sorry, the server didn't respond in time. Please try your request again later or contact the administrator if the problem persists.`,
          );
        }
      },
    });
  }

  loginWithFacebook() {
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
        console.log('User cancelled login or did not fully authorize.');
      }
    });
     */
  }

  loginWithInstagram() {
    /** this.authService.loginWithInstagram(); */
  }
}
