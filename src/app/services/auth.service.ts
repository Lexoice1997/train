import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { SignupResponse } from "../models/signup-response.model";
import { SigninResponse } from "../models/signin-response.model";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public isAuthenticated = signal(false);

  private readonly apiSignupUrl = "/api/signup";

  private readonly apiSigninUrl = "/api/signin";

  private readonly apiLogoutUrl = "/api/logout";

  private httpClient: HttpClient;

  private storageService: StorageService;

  private _authToken: string;

  private readonly authTokenKey = "auth_token";

  constructor() {
    this.httpClient = inject(HttpClient);
    this.storageService = inject(StorageService);

    this._authToken = this.storageService.loadValue(this.authTokenKey) || "";
    if (this._authToken !== "") {
      this.isAuthenticated.set(true);
    }
  }

  public get authToken(): string {
    return this._authToken;
  }

  public signUp(email: string, password: string): Observable<SignupResponse> {
    const body = { email, password };
    return this.httpClient.post<SignupResponse>(this.apiSignupUrl, body);
  }

  public signIn(email: string, password: string): Observable<SigninResponse> {
    const body = { email, password };
    return this.httpClient.post<SigninResponse>(this.apiSigninUrl, body).pipe(
      tap((response) => {
        this._authToken = response.token;
        this.storageService.storeValue(this.authTokenKey, response.token);
        this.isAuthenticated.set(true);
      }),
    );
  }

  public signOut(): Observable<object> {
    return this.httpClient.delete(this.apiLogoutUrl, {}).pipe(
      tap(() => {
        this._authToken = "";
        this.storageService.clearValue(this.authTokenKey);
        this.isAuthenticated.set(false);
      }),
    );
  }
}
