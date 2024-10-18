import { HttpClient } from "@angular/common/http";
import { Injectable, effect, inject, signal } from "@angular/core";

import { catchError, Observable, tap, throwError } from "rxjs";

import { ProfileModel, ProfileRole } from "../models/profile.model";
import { ApiUrl } from "../models/apiurl.model";
import { RequestError } from "../models/error.model";

import { StorageService } from "./storage.service";
import { ErrorService } from "./error.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  public name = signal<string>("");

  public email = signal<string>("");

  public role = signal<ProfileRole>("");

  private readonly apiProfile: ApiUrl = "/api/profile";

  private readonly apiPassword: ApiUrl = "/api/profile/password";

  private httpClient = inject(HttpClient);

  private errorService = inject(ErrorService);

  protected authService = inject(AuthService);

  protected storageService = inject(StorageService);

  constructor() {
    effect(
      () => {
        if (this.authService.isAuthenticated()) {
          this.loadProfile();
        } else {
          this.clearProfile();
        }
      },
      {
        allowSignalWrites: true,
      },
    );
    this.role.set((this.storageService.loadValue("role") || "") as ProfileRole);
  }

  public setName(newName: string): Observable<object> {
    return this.httpClient
      .put(this.apiProfile, {
        email: this.email(),
        name: newName,
      })
      .pipe(
        tap(() => {
          this.name.set(newName);
        }),
        catchError((error: RequestError) => {
          return throwError(() =>
            this.errorService.handleError("PUT", this.apiProfile, error),
          );
        }),
      );
  }

  public setEmail(newEmail: string): Observable<object> {
    return this.httpClient
      .put(this.apiProfile, { email: newEmail, name: this.name() })
      .pipe(
        tap(() => {
          this.email.set(newEmail);
        }),
        catchError((error: RequestError) => {
          return throwError(() =>
            this.errorService.handleError("PUT", this.apiProfile, error),
          );
        }),
      );
  }

  public setPassword(newPassword: string): Observable<object> {
    return this.httpClient
      .put(this.apiPassword, { password: newPassword })
      .pipe(
        catchError((error: RequestError) => {
          return throwError(() =>
            this.errorService.handleError("PUT", this.apiPassword, error),
          );
        }),
      );
  }

  private loadProfile(): void {
    this.httpClient.get<ProfileModel>(this.apiProfile).subscribe((res) => {
      this.name.set(res.name ?? "");
      this.email.set(res.email ?? "");
      this.role.set(res.role ?? "");
      this.storageService.storeValue("role", res.role);
    });
  }

  private clearProfile(): void {
    this.name.set("");
    this.email.set("");
    this.role.set("");
    this.storageService.storeValue("role", "");
  }
}
