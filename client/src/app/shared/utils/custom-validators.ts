import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static matchWithValidation(targetControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const targetControl = control.root.get(targetControlName);
      if (control?.value.toString().length > 0) control.markAsTouched();

      return targetControl?.value !== control?.value ? { valueMismatch: true } : null;
    };
  }
}
