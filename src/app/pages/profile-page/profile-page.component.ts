import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";

import { emailValidator } from "../../validators/email.validator";
import { ProfileService } from "../../services/profile.service";
import { AuthService } from "../../services/auth.service";
import { finalize } from "rxjs";

@Component({
  selector: "ta-profile-page",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./profile-page.component.html",
  styleUrl: "./profile-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  @ViewChild("passwordDialog")
  protected passwordDialog: ElementRef<HTMLDialogElement> | null = null;

  protected name!: Signal<string>;

  protected email!: Signal<string>;

  protected nameForm!: FormGroup;

  protected emailForm!: FormGroup;

  protected passwordForm!: FormGroup;

  protected isNameEditing = signal<boolean>(false);

  protected isNameWaitingResponse = signal<boolean>(false);

  protected isEmailEditing = signal<boolean>(false);

  protected isEmailWaitingResponse = signal<boolean>(false);

  protected isPasswordWaitingResponse = signal<boolean>(false);

  private router;

  private formBuilder;

  private authService;

  private profileService;

  constructor() {
    this.router = inject(Router);
    this.authService = inject(AuthService);
    this.profileService = inject(ProfileService);
    this.formBuilder = inject(FormBuilder);

    effect(() => {
      if (this.nameInput) this.nameInput.setValue(this.name());
    });

    effect(() => {
      if (this.emailInput) this.emailInput.setValue(this.email());
    });
  }

  public ngOnInit(): void {
    this.name = this.profileService.name;
    this.email = this.profileService.email;
    this.nameForm = this.formBuilder.group({
      name: ["", [Validators.required]],
    });
    this.emailForm = this.formBuilder.group({
      email: ["", [Validators.required, emailValidator()]],
    });
    this.passwordForm = this.formBuilder.nonNullable.group({
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  protected get nameInput(): AbstractControl | null {
    return this.nameForm.get("name");
  }

  protected get emailInput(): AbstractControl | null {
    return this.emailForm.get("email");
  }

  protected get passwordInput(): AbstractControl | null {
    return this.passwordForm.get("password");
  }

  protected editName(): void {
    this.isNameEditing.set(true);
  }

  protected editEmail(): void {
    this.isEmailEditing.set(true);
  }

  protected updateName(): void {
    this.isNameWaitingResponse.set(true);
    this.profileService
      .setName(this.nameForm.value.name)
      .pipe(
        finalize(() => {
          this.isNameWaitingResponse.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.isNameEditing.set(false);
        },
        error: (error: ValidationErrors) => {
          this.nameForm.setErrors(error);
        },
      });
  }

  protected updateEmail(): void {
    this.isEmailWaitingResponse.set(true);
    this.profileService
      .setEmail(this.emailForm.value.email)
      .pipe(
        finalize(() => {
          this.isEmailWaitingResponse.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.isEmailEditing.set(false);
        },
        error: (error: ValidationErrors) => {
          this.emailInput?.setErrors(error);
        },
      });
  }

  protected showPasswordDialog(): void {
    this.passwordDialog?.nativeElement.showModal();
  }

  protected updatePassword(): void {
    this.isPasswordWaitingResponse.set(true);
    this.profileService
      .setPassword(this.passwordForm.value.password)
      .pipe(
        finalize(() => {
          this.isPasswordWaitingResponse.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.passwordDialog?.nativeElement.close();
        },
        error: (error: ValidationErrors) => {
          this.passwordInput?.setErrors(error);
        },
      });
  }

  protected logout(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
    });
  }
}
