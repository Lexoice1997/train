import { ChangeDetectionStrategy, Component } from "@angular/core";

import { AdminSubheaderComponent } from "../../components/admin-subheader/admin-subheader.component";

@Component({
  selector: "ta-routes-page",
  standalone: true,
  imports: [AdminSubheaderComponent],
  templateUrl: "./routes-page.component.html",
  styleUrl: "./routes-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesPageComponent {}
