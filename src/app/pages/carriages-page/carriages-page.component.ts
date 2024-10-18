import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { Carriage } from "../../models/carriage.model";

import { CarriagesService } from "../../services/carriages.service";

import { AdminSubheaderComponent } from "../../components/admin-subheader/admin-subheader.component";
import { CarriageComponent } from "../../components/carriage/carriage.component";

@Component({
  selector: "ta-carriages-page",
  standalone: true,
  imports: [AdminSubheaderComponent, CarriageComponent, ReactiveFormsModule],
  templateUrl: "./carriages-page.component.html",
  styleUrl: "./carriages-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesPageComponent {
  protected carriageTypes: Signal<Carriage[]>;

  protected formType: WritableSignal<"create" | "edit" | "none">;

  protected carriageForm: FormGroup;

  protected isWaitingResponse = signal(false);

  private readonly maxSeatsInRow = 6;

  private carriageService = inject(CarriagesService);

  private formBuilder = inject(FormBuilder);

  constructor() {
    this.carriageTypes = this.carriageService.carriageTypes;
    this.formType = signal("none");
    this.carriageForm = this.formBuilder.nonNullable.group({
      code: [""],
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      rows: [15, [Validators.required, Validators.min(12), Validators.max(20)]],
      leftSeats: [
        2,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      rightSeats: [
        2,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });

    this.leftSeatsInput.valueChanges.subscribe(() => {
      if (this.leftSeatsInput.value > 5 || this.leftSeatsInput.value < 1) {
        return;
      }
      if (
        this.leftSeatsInput.value + this.rightSeatsInput.value >
        this.maxSeatsInRow
      ) {
        this.rightSeatsInput.setValue(
          this.maxSeatsInRow - this.leftSeatsInput.value,
        );
      }
    });

    this.rightSeatsInput.valueChanges.subscribe(() => {
      if (this.rightSeatsInput.value > 5 || this.rightSeatsInput.value < 1) {
        return;
      }
      if (
        this.leftSeatsInput.value + this.rightSeatsInput.value >
        this.maxSeatsInRow
      ) {
        this.leftSeatsInput.setValue(
          this.maxSeatsInRow - this.rightSeatsInput.value,
        );
      }
    });
  }

  protected get codeInput(): FormControl {
    return this.carriageForm.get("code") as FormControl;
  }

  protected get leftSeatsInput(): FormControl {
    return this.carriageForm.get("leftSeats") as FormControl;
  }

  protected get rightSeatsInput(): FormControl {
    return this.carriageForm.get("rightSeats") as FormControl;
  }

  protected createCarriage(): void {
    this.carriageForm.reset();
    this.formType.set("create");
  }

  protected setCarriage(): void {
    this.isWaitingResponse.set(true);
    if (this.formType() === "create") {
      this.carriageService
        .createCarriage(this.carriageForm.value)
        .subscribe(() => {
          this.isWaitingResponse.set(false);
          this.formType.set("none");
        });
    } else if (this.formType() === "edit") {
      this.carriageService
        .updateCarriage(this.carriageForm.value)
        .subscribe(() => {
          this.isWaitingResponse.set(false);
          this.formType.set("none");
        });
    }
  }

  protected editCarriage(carriageType: Carriage): void {
    this.formType.set("edit");
    this.carriageForm.patchValue(carriageType);
  }

  protected deleteCarriage(carriageType: Carriage): void {
    this.isWaitingResponse.set(true);
    this.carriageService.deleteCarriage(carriageType.code).subscribe(() => {
      this.isWaitingResponse.set(false);
    });
  }
}
