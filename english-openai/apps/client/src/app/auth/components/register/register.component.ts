import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { UserRegistration, UserRegistrationResponse } from '../../../core/interfaces/user.interface';
import { ErrorMessageModule } from '../../../shared/components/error-message/error-message.module';
import { CustomSpinnerDirective } from '../../../shared/directives/custom-spinner.directive';
import { CustomValidators } from '../../../shared/utils/custom-validators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    MatCheckbox,
    ErrorMessageModule,
    MatButton,
    MatError,
    MatProgressSpinner,
    MatIcon,
    CustomSpinnerDirective,
  ],
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  isLoading: boolean = false;

  errors: string[] = [];

  constructor(
    private authService: AuthService,
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

  register() {
    this.errors = [];

    if (this.regForm.valid && !this.isLoading) {
      this.isLoading = true;
      const user: UserRegistration = {
        name: {
          firstName: this.regForm.get('firstName')!.value,
          lastName: this.regForm.get('lastName')!.value,
        },
        email: this.regForm.get('email')!.value,
        password: this.regForm.get('password')!.value,
      };

      this.authService.registration(user).subscribe({
        next: (result: UserRegistrationResponse) => {
          this.errors = [];
          this.isLoading = false;
          console.log('REGISTER SUCCESS -> redirect', result);
          this.router.navigate(['/auth/success-register'], {
            queryParams: {
              email: result.email,
              name: result.name,
              firstName: result.name.firstName,
              lastName: result.name.lastName,
            },
          });
          // this.router.navigate(['/auth/success-register']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errors = [];

          if (error.status === 0) {
            this.errors.push('Network error. Check your internet connection and try again.');
          }
          if (error.error.code === 'user/already-exists') {
            this.regForm.controls['email'].setErrors({ wrongUserEmail: true });
            this.errors.push('User with this email already registered');
          }

          if (error.status == 504) {
            this.errors.push(
              `Sorry, the server didn't respond in time. Please try your request again later or contact the administrator if the problem persists.`,
            );
          }
        },
      });
    }
  }
}
