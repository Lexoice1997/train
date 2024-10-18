import { CarriageInstance } from "./carriage.model";
import { RideInfo } from "./ride.model";
import { Ride, RouteSearchResponse } from "./routes.model";
import { StationSearchResponse } from "./stations.model";

export interface SearchResponse {
  from: StationSearchResponse;
  to: StationSearchResponse;
  routes: RouteSearchResponse[];
}

export interface SearchRideResponse {
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: Omit<Ride, "rideId">[];
}

export interface CarriageRideData {
  code: string;
  name: string;
  freeSeatsCount: number;
  price: number;
}

export interface Trip {
  rideId: number; // for trip request
  fromStationId: number; // for trip request
  toStationId: number; // for trip request
  fromStationName: string;
  toStationName: string;
  routeStartStationName: string;
  routeEndStationName: string;
  departureTime: string;
  arrivalTime: string;
  carriageData: CarriageRideData[];
  rideInfo: RideInfo;
  carriages: CarriageInstance[];
}
