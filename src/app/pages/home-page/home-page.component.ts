import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { Trip } from "../../models/search.model";
import { RideInfo } from "../../models/ride.model";

import { CitiesService } from "../../services/cities.service";
import { SearchService } from "../../services/search.service";

import { FilterTripsPipe } from "../../pipes/filter-trips.pipe";

import { CarriageListComponent } from "../../components/ride/ride.component";
import { RouteModalComponent } from "../../components/route-modal/route-modal.component";

@Component({
  selector: "ta-home-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CarriageListComponent,
    FilterTripsPipe,
    RouteModalComponent,
  ],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  @ViewChild("routeDialog", { static: true })
  protected routeDialog: ElementRef<HTMLDialogElement> | null = null;

  protected showTrips = signal<boolean>(true);

  protected form!: FormGroup;

  protected trips = signal<Trip[]>([]);

  protected error = signal("");

  protected today: string = new Date().toISOString().split("T")[0];

  protected filterDates = signal<string[]>([]);

  protected filterTripsDate = signal<string>("");

  protected citiesFrom = signal<string[]>([]);

  protected citiesTo = signal<string[]>([]);

  protected routeModalRideInfo = signal<RideInfo>({} as RideInfo);

  private location = inject(Location);

  private formBuilder = inject(FormBuilder);

  private searchService = inject(SearchService);

  private citiesService = inject(CitiesService);

  public ngOnInit(): void {
    this.form = this.formBuilder.nonNullable.group({
      cityFrom: ["", [Validators.required]],
      cityTo: ["", [Validators.required]],
      departureDate: ["", [Validators.required]],
      departureTime: [""],
    });
    this.cityFrom.valueChanges.subscribe((value) => {
      const cities = this.citiesService.getFirstNMatchingNames(value, 5);
      this.citiesFrom.set(cities);
    });
    this.cityTo.valueChanges.subscribe((value) => {
      const cities = this.citiesService.getFirstNMatchingNames(value, 5);
      this.citiesTo.set(cities);
    });
  }

  protected get cityFrom(): FormControl {
    return this.form.get("cityFrom") as FormControl;
  }

  protected get cityTo(): FormControl {
    return this.form.get("cityTo") as FormControl;
  }

  protected get departureDate(): FormControl {
    return this.form.get("departureDate") as FormControl;
  }

  protected get departureTime(): FormControl {
    return this.form.get("departureTime") as FormControl;
  }

  public swapValues(): void {
    const station1 = this.cityFrom.value;
    const station2 = this.cityTo.value;
    this.form.patchValue({
      cityFrom: station2,
      cityTo: station1,
    });
  }

  public search(): void {
    const cityFromCoords = this.citiesService.getCoordinatesByName(
      this.cityFrom.value,
    );
    const cityToCoords = this.citiesService.getCoordinatesByName(
      this.cityTo.value,
    );
    if (!cityFromCoords || !cityToCoords) {
      // @TODO show error
      return;
    }
    const [fromLatitude, fromLongitude] = cityFromCoords;
    const [toLatitude, toLongitude] = cityToCoords;
    const time = new Date(this.departureDate.value);
    if (this.departureTime.value) {
      const [hours, minutes] = this.departureTime.value
        .split(":")
        .map((v: string) => Number.parseInt(v, 10));
      time.setHours(hours, minutes, 0, 0);
    }

    this.searchService
      .search(
        fromLatitude,
        fromLongitude,
        toLatitude,
        toLongitude,
        time.getTime(),
      )
      .subscribe({
        next: (response) => {
          this.filterTripsDate.set("");
          this.trips.set(response);
          const dates = Array.from(
            new Set(response.map((trip) => trip.departureTime.slice(0, 10))),
          ).sort();
          this.filterDates.set(dates);
        },
      });
  }

  protected setFilterTripsDate(date: string): void {
    if (date === this.filterTripsDate()) {
      this.filterTripsDate.set("");
    } else {
      this.filterTripsDate.set(date);
    }
  }

  protected showRoute(rideInfo: RideInfo): void {
    const dialog = document.getElementById("dialog") as HTMLDialogElement;
    this.routeModalRideInfo.set(rideInfo);
    dialog.showModal();
  }

  protected bookTicket(
    rideId: number,
    from: number,
    to: number,
    carriageCode: string,
  ): void {
    console.log(rideId, from, to, carriageCode);
  }
}
