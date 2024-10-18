import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  public storeValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public loadValue(key: string): string | null {
    return localStorage.getItem(key);
  }

  public clearValue(key: string): void {
    localStorage.removeItem(key);
  }
}
