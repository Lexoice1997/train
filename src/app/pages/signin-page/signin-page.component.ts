import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";

import { AuthService } from "../../services/auth.service";
import { emailValidator } from "../../validators/email.validator";
import { SignupResponse } from "../../models/signup-response.model";
import { passwordValidator } from "../../validators/password.validator";

@Component({
  selector: "ta-signin-page",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./signin-page.component.html",
  styleUrl: "./signin-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninPageComponent implements OnInit {
  protected signinForm: FormGroup | null = null;

  protected errorMessage: string | null = null;

  protected isSubmitting = false;

  protected formSubmitted = false;

  private authService: AuthService;

  private formBuilder: FormBuilder;

  private router: Router;

  constructor() {
    this.authService = inject(AuthService);
    this.formBuilder = inject(FormBuilder);
    this.router = inject(Router);
  }

  public ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      email: ["", [Validators.required, emailValidator()]],
      password: ["", [Validators.required, passwordValidator()]],
    });
  }

  public onSubmit(): void {
    this.formSubmitted = true;
    if (!this.signinForm?.valid) return;
    this.isSubmitting = true;
    const { email, password } = this.signinForm.value;

    this.authService.signIn(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(["/"]);
      },
      error: (error: HttpErrorResponse) => {
        if (error.error.reason) {
          this.handleErrorResponse(error.error);
        } else {
          this.isSubmitting = false;
          this.errorMessage = "An unexpected error occurred";
        }
      },
    });
  }

  protected goToSignUp(): void {
    this.router.navigate(["/signup"]);
  }

  private handleErrorResponse(response: SignupResponse): void {
    switch (response.reason) {
      case "userNotFound":
        this.signinForm?.setErrors({ userNotFound: true });
        break;
      case "invalidEmail":
        this.signinForm?.setErrors({ invalidEmail: true });
        break;
      case "invalidPassword":
        this.signinForm?.setErrors({ invalidPassword: true });
        break;
      case "invalidFields":
        this.signinForm?.setErrors({ invalidFields: true });
        break;
      case "alreadyLoggedIn":
        this.signinForm?.setErrors({ alreadyLoggedIn: true });
        break;
      default:
        break;
    }

    this.errorMessage = response.message;
    this.isSubmitting = false;
  }
}
