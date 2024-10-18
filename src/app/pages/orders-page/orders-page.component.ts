import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ta-orders-page",
  standalone: true,
  imports: [],
  templateUrl: "./orders-page.component.html",
  styleUrl: "./orders-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {}
