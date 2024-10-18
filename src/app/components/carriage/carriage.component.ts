import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

import { Carriage, CarriageInstance } from "../../models/carriage.model";

@Component({
  selector: "ta-carriage",
  standalone: true,
  imports: [],
  templateUrl: "./carriage.component.html",
  styleUrl: "./carriage.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageComponent implements OnChanges {
  @Input({ required: true }) public carriage!: Carriage;

  @Input() public carriageInstance: CarriageInstance | null = null;

  protected seats: number[] = [];

  @HostBinding("style.--seats-in-row") private seatsInRow = 0;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["carriage"] || changes["carriageInstance"]) {
      if (
        this.carriage.leftSeats + this.carriage.rightSeats > 6 ||
        this.carriage.leftSeats + this.carriage.rightSeats < 2 ||
        this.carriage.leftSeats < 1 ||
        this.carriage.rightSeats < 1 ||
        this.carriage.rows < 12 ||
        this.carriage.rows > 20
      ) {
        this.seats = [];
        return;
      }
      const startSeatIdx = this.carriageInstance?.startSeatNumber || 0;
      const seatsCount =
        (this.carriage.leftSeats + this.carriage.rightSeats) *
        this.carriage.rows;
      this.seats = new Array(seatsCount)
        .fill(0)
        .map((_, idx) => idx + startSeatIdx);
      this.seatsInRow = this.carriage.leftSeats + this.carriage.rightSeats;
    }
  }
}
