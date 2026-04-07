import { LoginPayload } from '@entities/session/api';
import { SessionFacade } from '@entities/session/model/session.facade';
import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';
import { ErrorMessageModule } from '@shared/ui/error-message/error-message.module';
import { UiKitModule } from '@shared/ui/ui-kit';

import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feature-auth-by-email-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  standalone: true,
  imports: [UiKitModule, NgIf, ReactiveFormsModule, ErrorMessageModule, CustomSpinnerDirective],
})
export class AuthByEmailFormComponent {
  private sessionFacade = inject(SessionFacade);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Пытаемся получить ссылку на диалог, если компонент открыт в нем
  readonly dialogRef = inject(MatDialogRef, { optional: true });

  protected isLoading = signal(false);
  public isDialog = !!this.dialogRef; // Флаг: в диалоге мы или нет

  loginForm!: FormGroup;

  errors: string[] = [];

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['sychov.sergei+student@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
    // new FormGroup({
    //   email: new FormControl('sychov.sergei+student@gmail.com', [Validators.required, Validators.email]),
    //   password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
    // });

    // this.closeAllDialogs();
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      const user: LoginPayload = {
        email: this.loginForm.get('email')!.value,
        password: this.loginForm.get('password')!.value,
      };

      this.errors = [];

      this.sessionFacade
        .login(user)
        .then(() => {
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/']);
          }
        })
        .catch((error) => this.handleError(error))
        .finally(() => this.isLoading.set(false));
    }
  }

  cancel(): void {
    this.dialogRef?.close();
  }

  private handleError(error: HttpErrorResponse): void {
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
  }
}
