export interface RouteSearchResponse {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Ride[];
}

export interface Segment {
  time: string[];
  price: Record<string, number>;
  occupiedSeats: number[];
}

export interface Ride {
  rideId: number;
  segments: Segment[];
}
