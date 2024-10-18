import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from "@angular/core";
import { Location } from "@angular/common";

import { HeaderLinkComponent } from "../header-link/header-link.component";

@Component({
  selector: "ta-admin-subheader",
  standalone: true,
  imports: [HeaderLinkComponent],
  templateUrl: "./admin-subheader.component.html",
  styleUrl: "./admin-subheader.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSubheaderComponent {
  protected currentPage: WritableSignal<string>;

  private location: Location;

  constructor() {
    this.location = inject(Location);
    this.currentPage = signal(this.location.path().split("/")[2]);
    this.location.onUrlChange((url) => {
      this.currentPage.set(url.split("/")[2]);
    });
  }
}
