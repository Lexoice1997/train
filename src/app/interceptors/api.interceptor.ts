import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  req = req.clone({
    headers: req.headers.set(
      "Authorization",
      `Bearer ${authService.authToken}`,
    ),
  });
  return next(req);
};
