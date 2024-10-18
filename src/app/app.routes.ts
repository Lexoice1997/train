import { Routes } from "@angular/router";

import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { SignupPageComponent } from "./pages/signup-page/signup-page.component";
import { SigninPageComponent } from "./pages/signin-page/signin-page.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { OrdersPageComponent } from "./pages/orders-page/orders-page.component";
import { StationsPageComponent } from "./pages/stations-page/stations-page.component";
import { CarriagesPageComponent } from "./pages/carriages-page/carriages-page.component";
import { RoutesPageComponent } from "./pages/routes-page/routes-page.component";

import { isLoggedInGuard } from "./guards/is-logged-in.guard";
import { isNotLoggedInGuard } from "./guards/is-not-logged-in.guard";
import { isManagerGuard } from "./guards/is-manager.guard";

export const routes: Routes = [
  { path: "", component: HomePageComponent },
  {
    path: "signup",
    component: SignupPageComponent,
    canActivate: [isNotLoggedInGuard],
  },
  {
    path: "signin",
    component: SigninPageComponent,
    canActivate: [isNotLoggedInGuard],
  },
  {
    path: "profile",
    component: ProfilePageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: "trip/:rideId",
    component: HomePageComponent,
  },
  {
    path: "orders",
    component: OrdersPageComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: "admin/stations",
    component: StationsPageComponent,
    canActivate: [isManagerGuard],
  },
  {
    path: "admin/carriages",
    component: CarriagesPageComponent,
    canActivate: [isManagerGuard],
  },
  {
    path: "admin/routes",
    component: RoutesPageComponent,
    canActivate: [isManagerGuard],
  },
  {
    path: "**",
    component: NotFoundPageComponent,
  },
];
