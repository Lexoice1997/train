import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ta-not-found-page",
  standalone: true,
  imports: [],
  templateUrl: "./not-found-page.component.html",
  styleUrl: "./not-found-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
