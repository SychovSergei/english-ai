import { AbstractControl } from '@angular/forms';

/**
 * Adds a custom validation error to the given `AbstractControl` without removing existing errors.
 *
 * If the control already has errors, the new error is added to the existing list.
 *
 * @typeParam T - The type of the value associated with the error (e.g., a string message or error metadata).
 * @param control - The Angular form control (`FormControl`, `FormGroup`, or `FormArray`) to which the error should be added.
 * @param errorKey - A unique key identifying the error (e.g., `'required'`, `'duplicate'`, `'serverError'`).
 * @param value - The value associated with the error (usually `true` or an object describing the issue).
 *
 * @example
 * ```ts
 * addControlError(control, 'serverError', 'Word already exists');
 * ```
 */
export function addControlError<T>(control: AbstractControl, errorKey: string, value: T): void {
  const currentErrors = control.errors ?? {};
  control.setErrors({ ...currentErrors, [errorKey]: value });
}

/**
 * Removes a specific validation error from the given `AbstractControl` without affecting other errors.
 *
 * If the specified error is present, it is removed. If no other errors remain after removal,
 * the control's `errors` property is set to `null`.
 *
 * @param control - The Angular form control (`FormControl`, `FormGroup`, or `FormArray`) from which the error should be removed.
 * @param errorKey - The key of the error to remove (e.g., `'required'`, `'duplicate'`, `'serverError'`).
 *
 * @example
 * ```ts
 * removeControlError(control, 'serverError');
 * ```
 */
export function removeControlError(control: AbstractControl, errorKey: string): void {
  const currentErrors = { ...control.errors };
  delete currentErrors[errorKey];
  const hasErrors = Object.keys(currentErrors).length > 0;
  control.setErrors(hasErrors ? currentErrors : null);
}
