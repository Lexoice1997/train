import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { catchError, Observable, tap, throwError } from "rxjs";

import { ApiUrl } from "../models/apiurl.model";
import { Carriage } from "../models/carriage.model";

import { ErrorService } from "./error.service";
import { RequestError } from "../models/error.model";

@Injectable({
  providedIn: "root",
})
export class CarriagesService {
  public carriageTypes = signal<Carriage[]>([]);

  private readonly carriageUrl: ApiUrl = "/api/carriage";

  private errorService = inject(ErrorService);

  private httpClient: HttpClient = inject(HttpClient);

  public loadCarriages(): Observable<Carriage[]> {
    return this.httpClient
      .get<Carriage[]>(this.carriageUrl)
      .pipe(tap((carriages) => this.carriageTypes.set(carriages)));
  }

  public getSeatsCount(carriage: string): number {
    const c = this.carriageTypes().find((c) => c.code === carriage);
    if (!c) return 0;
    return (c.rightSeats + c.leftSeats) * c.rows;
  }

  public getCarriageNameByCode(code: string): string {
    const c = this.carriageTypes().find((c) => c.code === code);
    if (!c) return "";
    return c.name;
  }

  public createCarriage(carriage: Carriage): Observable<Carriage> {
    return this.httpClient.post<Carriage>(this.carriageUrl, carriage).pipe(
      tap(() => {
        this.loadCarriages().subscribe();
      }),
      catchError((error: RequestError) => {
        return throwError(() =>
          this.errorService.handleError("POST", this.carriageUrl, error),
        );
      }),
    );
  }

  public updateCarriage(carriage: Carriage): Observable<Carriage> {
    return this.httpClient
      .put<Carriage>(`${this.carriageUrl}/${carriage.code}`, carriage)
      .pipe(
        tap(() => {
          this.loadCarriages().subscribe();
        }),
        catchError((error: RequestError) => {
          return throwError(() =>
            this.errorService.handleError("PUT", this.carriageUrl, error),
          );
        }),
      );
  }

  public deleteCarriage(code: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.carriageUrl}/${code}`).pipe(
      tap(() => {
        this.loadCarriages().subscribe();
      }),
      catchError((error: RequestError) => {
        return throwError(() =>
          this.errorService.handleError("DELETE", "/api/carriage/:code", error),
        );
      }),
    );
  }
}
