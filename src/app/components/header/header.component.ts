import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import { Location } from "@angular/common";

import { HeaderLinkComponent } from "../header-link/header-link.component";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "ta-header",
  standalone: true,
  imports: [HeaderLinkComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected isAuthenticated: Signal<boolean>;

  protected isManager: Signal<boolean>;

  protected currentPage: WritableSignal<string>;

  private authService: AuthService;

  private profileService: ProfileService;

  private location: Location;

  constructor() {
    this.location = inject(Location);
    this.authService = inject(AuthService);
    this.profileService = inject(ProfileService);
    this.isAuthenticated = this.authService.isAuthenticated;
    this.isManager = computed(() => this.profileService.role() === "manager");
    this.currentPage = signal(this.location.path().split("/")[1]);
    this.location.onUrlChange((url) => {
      let activePage = url.split("/")[1];
      if (activePage === "" || activePage === "trip") activePage = "home";
      this.currentPage.set(activePage);
    });
  }
}
