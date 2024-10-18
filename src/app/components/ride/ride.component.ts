import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

import { Trip } from "../../models/search.model";

import { FormatTimePipe } from "../../pipes/format-time.pipe";

@Component({
  selector: "ta-ride",
  standalone: true,
  imports: [CommonModule, FormatTimePipe],
  templateUrl: "./ride.component.html",
  styleUrl: "./ride.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageListComponent implements OnInit {
  @Output() public showRouteEvent = new EventEmitter<void>();

  @Input({ required: true }) public trip!: Trip;

  @Input({ required: true }) public bookTicket!: (
    rideId: number,
    from: number,
    to: number,
    carriageCode: string,
  ) => void;

  protected travelTime = signal<number>(0);

  private router = inject(Router);

  @HostBinding("class.card") private readonly classCard = true;

  public ngOnInit(): void {
    const travelTime =
      new Date(this.trip.arrivalTime).getTime() -
      new Date(this.trip.departureTime).getTime();

    this.travelTime.set(travelTime / 1000 / 60);
  }

  public buyTrip(): void {
    this.router.navigate(["/trip"]);
  }

  public showRoute(): void {
    this.showRouteEvent.emit();
  }
}
