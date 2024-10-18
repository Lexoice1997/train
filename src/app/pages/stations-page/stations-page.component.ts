import { ChangeDetectionStrategy, Component } from "@angular/core";

import { AdminSubheaderComponent } from "../../components/admin-subheader/admin-subheader.component";

@Component({
  selector: "ta-stations-page",
  standalone: true,
  imports: [AdminSubheaderComponent],
  templateUrl: "./stations-page.component.html",
  styleUrl: "./stations-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsPageComponent {}
