import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export function markAllControlsAsTouchedAndDirty(control: AbstractControl): void {
  if (control instanceof FormControl) {
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  } else if (control instanceof FormGroup || control instanceof FormArray) {
    Object.values(control.controls).forEach((childControl) => {
      markAllControlsAsTouchedAndDirty(childControl);
    });
    control.updateValueAndValidity();
  }
}
