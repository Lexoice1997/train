import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { apiInterceptor } from "./interceptors/api.interceptor";
import { CarriagesService } from "./services/carriages.service";
import { forkJoin, Observable } from "rxjs";
import { StationsService } from "./services/stations.service";
import { Carriage } from "./models/carriage.model";
import { Station } from "./models/stations.model";

export function initializeApp(
  carriagesService: CarriagesService,
  stationsService: StationsService,
): () => Observable<[Carriage[], Station[]]> {
  return () => {
    return forkJoin([
      carriagesService.loadCarriages(),
      stationsService.loadStations(),
    ]);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [CarriagesService, StationsService],
      multi: true,
    },
  ],
};
