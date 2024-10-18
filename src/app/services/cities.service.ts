import { computed, inject, Injectable, Signal } from "@angular/core";

import { City } from "../models/city.model";
import { StationsService } from "./stations.service";

@Injectable({
  providedIn: "root",
})
export class CitiesService {
  private stationsService: StationsService;

  private cities: Signal<City[]>;

  constructor() {
    this.stationsService = inject(StationsService);
    this.cities = computed<City[]>(() =>
      Array.from(this.stationsService.stations().values()) // @TODO
        .map((station) => ({
          name: station.city,
          latitude: station.latitude,
          longitude: station.longitude,
        }))
        .sort((a: City, b: City) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        ),
    );
  }

  public getFirstNMatchingNames(pattern: string, n: number): string[] {
    pattern = pattern.toLowerCase();
    const result: string[] = [];
    let cityIdx = this.binarySearchFirstMatch(this.cities(), pattern);

    if (cityIdx === -1) return result;

    while (result.length < n && cityIdx < this.cities().length) {
      const city = this.cities()[cityIdx];
      if (city.name.toLowerCase().startsWith(pattern)) {
        result.push(city.name);
      }
      cityIdx += 1;
    }

    return result;
  }

  public getCoordinatesByName(name: string): [number, number] | null {
    const city = this.cities().find((city) => city.name === name);
    return city ? [city.latitude, city.longitude] : null;
  }

  private binarySearchFirstMatch(arr: City[], pattern: string) {
    pattern = pattern.toLowerCase();
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid].name.toLowerCase().startsWith(pattern)) {
        result = mid;
        right = mid - 1;
      } else if (
        arr[mid].name
          .toLowerCase()
          .localeCompare(pattern, undefined, { numeric: true }) < 0
      ) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }
}
