import { LoginService } from '@features/auth';
import { ErrorMessageModule } from '@shared/ui/error-message/error-message.module';
import { UiKitModule } from '@shared/ui/ui-kit';

import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

export interface LoginFormValue {
  email: string;
  password: string;
}

@Component({
  standalone: true,
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  imports: [NgIf, ErrorMessageModule, ReactiveFormsModule, MatDialogActions, UiKitModule, RouterLink],
})
export class LoginDialogComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmit: boolean = false;

  errors: string[] = [];

  private fb: FormBuilder = inject(FormBuilder);
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);

  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  constructor /** private fbService: FacebookSdkService, */() {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['sychov.sergei+student@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    const user: LoginFormValue = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
    };

    this.isSubmit = true;
    this.errors = [];

    this.loginService.login(user).subscribe({
      next: (result) => {
        console.log('result', result);
        // this.isSubmit = false;
        this.dialogRef.close({ success: true });
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

  cancel(): void {
    this.dialogRef.close({ success: false });
  }

  toRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
