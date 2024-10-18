import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { ProfileService } from "../services/profile.service";

export const isManagerGuard: CanActivateFn = () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  return profileService.role() === "manager" || router.createUrlTree(["/"]);
};
