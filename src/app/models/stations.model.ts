interface Connection {
  id: number;
  distance: number;
}

export interface Station {
  city: string;
  connectedTo: Connection[];
  id: number;
  latitude: number;
  longitude: number;
}

//@TODO remove connectedTo, add relationships
export type StationAddRequest = Omit<Station, "id">;

export interface StationSearchResponse {
  city: string;
  stationId: number;
  geolocation: {
    latitude: number;
    longitude: number;
  };
}
