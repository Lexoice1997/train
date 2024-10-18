import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ta-rides-page",
  standalone: true,
  imports: [],
  templateUrl: "./rides-page.component.html",
  styleUrl: "./rides-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RidesPageComponent {}
