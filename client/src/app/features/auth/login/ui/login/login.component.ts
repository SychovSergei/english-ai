import { LoginService } from '@features/auth/login/api/login.service';
import { IUserLoginDTO } from '@shared/api';
import { ErrorMessageModule } from '@shared/ui/error-message/error-message.module';
import { UiKitModule } from '@shared/ui/ui-kit';

import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [UiKitModule, ReactiveFormsModule, RouterLink, ErrorMessageModule, NgIf],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmit: boolean = false;

  errors: string[] = [];

  readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    /** private fbService: FacebookSdkService, */
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['sychov.sergei+student@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
    // new FormGroup({
    //   email: new FormControl('sychov.sergei+student@gmail.com', [Validators.required, Validators.email]),
    //   password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
    // });

    this.closeAllDialogs();
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }

  toRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  login(): void {
    const user: IUserLoginDTO = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
    };
    this.isSubmit = true;
    this.errors = [];

    this.loginService.login(user).subscribe({
      next: (result) => {
        console.log('result', result);
        this.isSubmit = false;
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
          this.errors.push('Wrong email. user-model with this email does not exist.');
        }
        if (error.error.code === 'user/not-activated') {
          this.errors.push('user-model is not activated! Please check email and activate user.');
        }
        if (error.status == 504) {
          this.errors.push(
            `Sorry, the server didn't respond in time. Please try your request again later or contact the administrator if the problem persists.`,
          );
        }
      },
    });
  }

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
