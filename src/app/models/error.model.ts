import { HttpMethod } from "./httpmethod.model";
import { ApiUrl } from "./apiurl.model";

export interface RequestError {
  error?: {
    message: string;
    reason: string;
  };
}

export type RequestSignature = `${HttpMethod} ${ApiUrl}`;
