export interface Carriage {
  code: string;
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
}

export interface CarriageInstance {
  number: number; // in train
  code: string;
  startSeatNumber: number;
  seatsCount: number;
  seatsOccupation: number[]; // 0 - free 1 - occupied
}
