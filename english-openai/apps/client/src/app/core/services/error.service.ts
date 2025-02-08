import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SharedApiErrorInterface, SharedValidationError } from '@shared/errors/error-types';

import { SnackBarComponent } from '../../shared/components/snack-bar/snack-bar.component';
import { CustomHttpErrorResponse } from '../interfaces/error.interface';

export interface SnackBarMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private _snackBar = inject(MatSnackBar);

  constructor(private snackBar: MatSnackBar) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: CustomHttpErrorResponse<SharedApiErrorInterface<any>>, form: FormGroup | null = null): void {
    console.log(error);
    /** if validation errors */
    if (error?.error.validationErrors.length > 0 && form) {
      this.handleValidationError(error.error.validationErrors, form);
    } else {
      /** if common/operation error*/
      this._snackBar.openFromComponent<unknown, SnackBarMessage>(SnackBarComponent, {
        duration: 10000,
        data: { type: 'error', message: error.message || 'Error message' },
      });
    }
  }

  private handleValidationError(errors: SharedValidationError[], form: FormGroup): void {
    errors.forEach((err) => {
      // TODO сделать выбор контрола из массива строк и чисел
      //  { "path": [ "translations", 0, "text"], "message": "Required" }
      const control = form.get(err.path);
      console.log(control);
      if (control) {
        control.setErrors({ serverError: err.message });
        // control.markAsTouched();

        // control.updateValueAndValidity(); // Принудительное обновление
      }
    });
    console.log(form);
    // Показываем сообщение об ошибке
    this.snackBar.open('Form validation failed. Please check the highlighted fields.', 'Close', {
      duration: 5000,
    });
  }
}
