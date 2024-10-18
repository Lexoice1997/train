import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { RouteResponse } from "../models/ride.model";
import { ErrorService } from "./error.service";
import { RequestError } from "../models/error.model";
import { ApiUrl } from "../models/apiurl.model";

@Injectable({
  providedIn: "root",
})
export class RideService {
  private readonly apiRoute: ApiUrl = "/api/route";

  private readonly apiSearchRide: ApiUrl = "/api/search";

  private httpClient: HttpClient = inject(HttpClient);

  private errorService = inject(ErrorService);

  public loadRouteById(id: number): Observable<RouteResponse> {
    return this.httpClient.get<RouteResponse>(`${this.apiRoute}/${id}`).pipe(
      catchError((error: RequestError) => {
        return throwError(() =>
          this.errorService.handleError("GET", "/api/route/:id", error),
        );
      }),
    );
  }
}
