import { Pipe, PipeTransform } from "@angular/core";
import { Trip } from "../models/search.model";

@Pipe({
  name: "filterTrips",
  standalone: true,
})
export class FilterTripsPipe implements PipeTransform {
  public transform(trips: Trip[], time: string): Trip[] {
    return trips
      .filter((trip) => time === "" || trip.departureTime.slice(0, 10) === time)
      .sort((a, b) => {
        const timeA = new Date(a.departureTime).getTime();
        const timeB = new Date(b.departureTime).getTime();
        return timeA - timeB;
      });
  }
}
