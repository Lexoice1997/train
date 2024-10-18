import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RideInfo } from "../../models/ride.model";
import { DatePipe } from "@angular/common";
import { FormatTimePipe } from "../../pipes/format-time.pipe";

@Component({
  selector: "[ta-route-modal]",
  standalone: true,
  imports: [DatePipe, FormatTimePipe],
  templateUrl: "./route-modal.component.html",
  styleUrl: "./route-modal.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteModalComponent {
  @Input({ required: true }) public rideInfo!: RideInfo;
}
