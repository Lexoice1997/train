import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { ApiUrl } from "../models/apiurl.model";
import { CarriageRideData, SearchResponse, Trip } from "../models/search.model";

import { CarriagesService } from "./carriages.service";
import { CarriageInstance } from "../models/carriage.model";
import { Segment } from "../models/routes.model";
import { StationsService } from "./stations.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private apiUrl: ApiUrl = "/api/search";

  private httpClient: HttpClient = inject(HttpClient);

  private stationsService: StationsService = inject(StationsService);

  private carriagesService: CarriagesService = inject(CarriagesService);

  public search(
    fromLatitude: number,
    fromLongitude: number,
    toLatitude: number,
    toLongitude: number,
    time: number,
  ): Observable<Trip[]> {
    let params = new HttpParams()
      .set("fromLatitude", fromLatitude)
      .set("fromLongitude", fromLongitude)
      .set("toLatitude", toLatitude)
      .set("toLongitude", toLongitude);
    if (time) {
      params = params.set("time", time);
    }
    return this.httpClient
      .get<SearchResponse>(this.apiUrl, { params })
      .pipe(map((res: SearchResponse) => this.processSearchResponse(res)));
  }

  private processSearchResponse(response: SearchResponse): Trip[] {
    const trips: Trip[] = [];
    const fromStationId = response.from.stationId;
    const toStationId = response.to.stationId;
    const fromStationName = response.from.city;
    const toStationName = response.to.city;
    response.routes.forEach((route) => {
      const firstSegmentIdx = route.path.indexOf(fromStationId);
      const lastSegmentIdx = route.path.indexOf(toStationId) - 1;
      const routeStartStationName = this.stationsService.getStationNameById(
        route.path[0],
      );
      const routeEndStationName = this.stationsService.getStationNameById(
        route.path[route.path.length - 1],
      );
      const pathSlice: number[] = route.path.slice(
        firstSegmentIdx,
        lastSegmentIdx + 2,
      );
      route.schedule.forEach((ride) => {
        const segmentsSlice = ride.segments.slice(
          firstSegmentIdx,
          lastSegmentIdx + 1,
        );
        const trip = this.createTrip(response);
        trip.rideId = ride.rideId;
        trip.fromStationName = fromStationName;
        trip.toStationName = toStationName;
        trip.routeStartStationName = routeStartStationName;
        trip.routeEndStationName = routeEndStationName;
        trip.rideInfo.routeId = route.id;
        this.fillRideInfo(trip, pathSlice, segmentsSlice);
        this.fillTripCarriage(trip, segmentsSlice, route.carriages, true);
        trips.push(trip);
      });
    });
    return trips;
  }

  private createTrip(searchResponse: SearchResponse): Trip {
    return {
      rideId: 0,
      fromStationId: searchResponse.from.stationId,
      toStationId: searchResponse.to.stationId,
      fromStationName: "",
      toStationName: "",
      routeStartStationName: "",
      routeEndStationName: "",
      departureTime: "",
      arrivalTime: "",
      carriageData: [],
      rideInfo: {
        routeId: 0,
        elements: [],
      },
      carriages: [],
    };
  }

  private fillTripCarriage(
    trip: Trip,
    segmentsSlice: Segment[],
    carriagesCodes: string[],
    fillCarriages: boolean,
  ): void {
    const carriageInfo: Record<
      string,
      { freeSeatsCount: number; price: number }
    > = {};
    new Set(carriagesCodes).forEach((carriageCode) => {
      carriageInfo[carriageCode] = {
        freeSeatsCount: 0,
        price: 0,
      };
    });

    let seatsCount = 0;
    const carriages: CarriageInstance[] = carriagesCodes.map(
      (carriageCode, carriageIdx): CarriageInstance => {
        const carriageSeatsCount =
          this.carriagesService.getSeatsCount(carriageCode);
        const r = {
          number: carriageIdx,
          code: carriageCode,
          startSeatNumber: seatsCount,
          seatsCount: carriageSeatsCount,
          seatsOccupation: [],
        };
        seatsCount += carriageSeatsCount;
        return r;
      },
    );

    const seats: number[] = new Array(seatsCount).fill(0);

    // price
    segmentsSlice.forEach((segment) => {
      Object.keys(segment.price).forEach((carriageCode) => {
        carriageInfo[carriageCode].price += segment.price[carriageCode];
      });
    });

    // free seats
    segmentsSlice.forEach((segment) => {
      segment.occupiedSeats.forEach((seatIdx) => {
        seats[seatIdx] = 1;
      });
    });

    // free seats per carriage type
    let seatIdx = 0;
    carriages.forEach((carriage) => {
      for (let i = 0; i < carriage.seatsCount; i += 1) {
        carriageInfo[carriage.code].freeSeatsCount += 1 - seats[seatIdx];
        seatIdx += 1;
      }
    });

    // return
    trip.departureTime = segmentsSlice[0].time[0];
    trip.arrivalTime = segmentsSlice[segmentsSlice.length - 1].time[1];
    trip.carriageData = Object.keys(carriageInfo).map(
      (carriageCode): CarriageRideData => ({
        code: carriageCode,
        name: this.carriagesService.getCarriageNameByCode(carriageCode),
        freeSeatsCount: carriageInfo[carriageCode].freeSeatsCount,
        price: carriageInfo[carriageCode].price,
      }),
    );

    // return carriages
    if (fillCarriages) {
      carriages.forEach((carriage) => {
        for (let i = 0; i < carriage.seatsCount; i += 1) {
          carriage.seatsOccupation[i] = seats[carriage.startSeatNumber + i];
        }
      });
      trip.carriages = carriages;
    }
  }

  private fillRideInfo(
    trip: Trip,
    pathSlice: number[],
    segmentsSlice: Segment[],
  ): void {
    trip.rideInfo.elements = pathSlice.map((stationId, idx) => {
      const time: [string, string] = ["", ""];
      let stopTime = 0;
      if (idx === 0) {
        time[1] = segmentsSlice[0].time[0];
      } else if (idx === pathSlice.length - 1) {
        time[0] = segmentsSlice[idx - 1].time[1];
      } else {
        time[0] = segmentsSlice[idx - 1].time[1];
        time[1] = segmentsSlice[idx].time[0];
        stopTime = new Date(time[1]).getTime() - new Date(time[0]).getTime();
      }

      return {
        time: time,
        stationName: this.stationsService.getStationNameById(stationId),
        stopTimeMs: stopTime,
      };
    });
  }
}
