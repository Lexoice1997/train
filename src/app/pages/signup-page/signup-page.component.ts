import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { passwordMatchValidator } from "../../validators/password-match.validator";
import { emailValidator } from "../../validators/email.validator";
import { SignupResponse } from "../../models/signup-response.model";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "ta-signup-page",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./signup-page.component.html",
  styleUrl: "./signup-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  public signupForm: FormGroup;
  public errorMessage: string | null = null;

  public isSubmitting = false;
  public formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group(
      {
        email: ["", [Validators.required, emailValidator()]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        repeatPassword: ["", [Validators.required]],
      },
      {
        validators: [passwordMatchValidator()],
      },
    );
  }

  public onSubmit(): void {
    this.formSubmitted = true;
    if (!this.signupForm.valid) return;
    this.isSubmitting = true;
    const { email, password } = this.signupForm.value;

    this.authService.signUp(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(["/signin"]);
      },
      error: (error: HttpErrorResponse) => {
        if (error.error.reason) {
          this.handleErrorResponse(error.error);
        } else {
          this.errorMessage = "An unexpected error occurred";
          this.isSubmitting = false;
        }
      },
    });
  }

  protected goToSignIn(): void {
    this.router.navigate(["/signin"]);
  }

  private handleErrorResponse(response: SignupResponse): void {
    switch (response.reason) {
      case "invalidEmail":
        this.signupForm.get("email")?.setErrors({ invalidEmail: true });
        break;
      case "invalidPassword":
        this.signupForm.get("password")?.setErrors({ invalidPassword: true });
        break;
      case "invalidUniqueKey":
        this.signupForm.get("email")?.setErrors({ emailExists: true });
        break;
      case "invalidFields":
        this.signupForm.setErrors({ invalidFields: true });
        break;
      default:
        break;
    }

    this.errorMessage = response.message;
    this.isSubmitting = false;
  }
}
