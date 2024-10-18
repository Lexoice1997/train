import { Ride } from "./routes.model";

interface RideInfoElement {
  time: [string, string];
  stationName: string;
  stopTimeMs: number;
}

export interface RideInfo {
  routeId: number;
  elements: RideInfoElement[];
}

export interface RouteResponse {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Ride[];
}
