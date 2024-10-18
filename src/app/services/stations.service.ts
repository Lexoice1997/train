import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Station, StationAddRequest } from "../models/stations.model";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ApiUrl } from "../models/apiurl.model";
import { ErrorService } from "./error.service";
import { RequestError } from "../models/error.model";

@Injectable({
  providedIn: "root",
})
export class StationsService {
  public stations = signal<Map<number, Station>>(new Map());

  private readonly apiStations: ApiUrl = "/api/station";

  private httpClient: HttpClient = inject(HttpClient);

  private errorService = inject(ErrorService);

  public loadStations(): Observable<Station[]> {
    return this.httpClient.get<Station[]>(this.apiStations).pipe(
      tap((data) => {
        this.stations.update((stations) => {
          stations.clear();
          return stations;
        });
        data.forEach((station) =>
          this.stations.update((stations) => stations.set(station.id, station)),
        );
      }),
    );
  }

  public getStationNameById(id: number): string {
    return this.stations().get(id)?.city || "";
  }

  public getConnectedStationsIds(id: number): number[] {
    return (
      this.stations()
        .get(id)
        ?.connectedTo.map((c) => c.id) || []
    );
  }

  public createStation(station: StationAddRequest): Observable<number> {
    return this.httpClient.post<number>(this.apiStations, station).pipe(
      tap(() => {
        this.loadStations();
      }),
      catchError((error: RequestError) => {
        return throwError(() =>
          this.errorService.handleError("POST", this.apiStations, error),
        );
      }),
    );
  }

  public deleteStation(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiStations}/${id}`).pipe(
      tap(() => {
        this.loadStations();
      }),
      catchError((error: RequestError) => {
        return throwError(() =>
          this.errorService.handleError(
            "DELETE",
            `${this.apiStations}/:id` as ApiUrl, // @TODO
            error,
          ),
        );
      }),
    );
  }
}
