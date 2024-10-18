import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {
  const pattern = /^[\w\d_]+@[\w\d_]+\.\w{2,7}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    return pattern.test(control.value) ? null : { invalidEmail: true };
  };
}
