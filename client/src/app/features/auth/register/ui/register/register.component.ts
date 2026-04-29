import { RegisterPayload, SessionFacade } from '@entities/session';
import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';
import { ErrorMessageModule } from '@shared/ui/error-message/error-message.module';
import { UiKitModule } from '@shared/ui/ui-kit';
import { CustomValidators } from '@shared/utils/custom-validators';

import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [UiKitModule, ReactiveFormsModule, RouterLink, NgIf, ErrorMessageModule, CustomSpinnerDirective],
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  protected isLoading = signal(false);

  errors: string[] = [];

  constructor(
    private sessionFacade: SessionFacade,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.regForm = new FormGroup({
      firstName: new FormControl('Serg', {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'blur',
      }),
      lastName: new FormControl('Sych', {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'blur',
      }),
      email: new FormControl('sychov.sergei+student@gmail.com', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      password: new FormControl('123456', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'blur',
      }),
      passwordConfirm: new FormControl('123456', {
        validators: [Validators.required, CustomValidators.matchWithValidation('password')],
        updateOn: 'blur',
      }),
      agree: new FormControl(true, [Validators.required, Validators.requiredTrue]),
    });
  }

  register(): void {
    if (this.regForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const user: RegisterPayload = {
        name: {
          firstName: this.regForm.get('firstName')!.value,
          lastName: this.regForm.get('lastName')!.value,
        },
        email: this.regForm.get('email')!.value,
        password: this.regForm.get('password')!.value,
      };

      this.errors = [];

      this.sessionFacade
        .register(user)
        .catch((error) => this.handleError(error))
        .finally(() => {
          this.errors = [];
          this.isLoading.set(false);
        });
    }
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.errors.push('Network error. Check your internet connection and try again.');
    }
    if (error.error.code === 'user/already-exists') {
      this.regForm.controls['email'].setErrors({ wrongUserEmail: true });
      this.errors.push('user-model with this email already registered');
    }

    if (error.status == 504) {
      this.errors.push(
        `Sorry, the server didn't respond in time. Please try your request again later or contact the administrator if the problem persists.`,
      );
    }
  }

  toLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
