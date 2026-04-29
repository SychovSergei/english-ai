import { CustomHttpErrorResponse } from '@shared/errors';
import { ApiErrorInterface, ValidationError } from '@shared/errors/error-types';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { SnackBarComponent } from '@shared/ui/snack-bar/snack-bar.component';

import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SnackBarMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private readonly loggerService = inject(LoggerService).createLogger('ErrorService');
  private _snackBar = inject(MatSnackBar);

  constructor(private snackBar: MatSnackBar) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: CustomHttpErrorResponse<ApiErrorInterface<any>>, form: FormGroup | null = null): void {
    this.loggerService.log('error', error);
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

  private handleValidationError(errors: ValidationError[], form: FormGroup): void {
    errors.forEach((err) => {
      // TODO сделать выбор контрола из массива строк и чисел
      //  { "path": [ "translations", 0, "text"], "message": "Required" }
      const control = form.get(err.path);
      this.loggerService.log('control', control);
      if (control) {
        control.setErrors({ serverError: err.message });
        // control.markAsTouched();

        // control.updateValueAndValidity(); // Принудительное обновление
      }
    });
    this.loggerService.log('form', form);
    // Показываем сообщение об ошибке
    this.snackBar.open('Form validation failed. Please check the highlighted fields.', 'Close', {
      duration: 5000,
    });
  }
}
