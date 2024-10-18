import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password")?.value;
    const repeatPassword = control.get("repeatPassword")?.value;

    return password !== repeatPassword ? { passwordsMismatch: true } : null;
  };
}
