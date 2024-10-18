import { Injectable } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { HttpMethod } from "../models/httpmethod.model";
import { ApiUrl } from "../models/apiurl.model";
import { RequestError, RequestSignature } from "../models/error.model";

const unknownError: ValidationErrors = { unknownError: true };
const getSignUpErrors: Record<string, ValidationErrors> = {
  "": {},
};
const getSignInErrors: Record<string, ValidationErrors> = {
  "": {},
};
const putProfileErors: Record<string, ValidationErrors> = {
  "Email already exists": { emailAlreadyExists: true },
};
const putPasswordErors: Record<string, ValidationErrors> = {
  "Password is wrong": { invalidPassword: true },
};
const postStationErrors: Record<string, ValidationErrors> = {
  "Invalid station data": { invalidStationData: true },
};
const deleteStationIdErrors: Record<string, ValidationErrors> = {
  "Station is already used": { stationIsAlreadyUsed: true },
};

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  public handleError(
    requestType: HttpMethod,
    requestUrl: ApiUrl,
    error: RequestError,
  ): ValidationErrors {
    if (!error.error) return unknownError;
    const signature: RequestSignature = `${requestType} ${requestUrl}`;
    const message = error.error.message;
    switch (signature) {
      case "GET /api/signup":
        return getSignUpErrors[message] ?? unknownError;
      case "GET /api/signin":
        return getSignInErrors[message] ?? unknownError;
      case "GET /api/logout":
        return unknownError;
      case "PUT /api/profile":
        return putProfileErors[message] ?? unknownError;
      case "PUT /api/profile/password":
        return putPasswordErors[message] ?? unknownError;
      case "POST /api/station":
        return postStationErrors[message] ?? unknownError;
      case "DELETE /api/station/:id":
        return deleteStationIdErrors[message] ?? unknownError;
      default:
        return unknownError;
    }
  }
}
