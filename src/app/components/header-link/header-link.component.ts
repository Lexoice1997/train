import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "ta-header-link",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./header-link.component.html",
  styleUrl: "./header-link.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderLinkComponent {
  @Input({ required: true }) public link = "";
}
