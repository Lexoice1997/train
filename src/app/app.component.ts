import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: "ta-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  private pressedDownElement: HTMLElement | null = null;

  constructor() {
    document.addEventListener("mousedown", (event) => {
      this.closeDialogOnOuterPressedDown(event);
    });
    document.addEventListener("click", (event) => {
      this.closeDialogOnOuterClick(event);
    });
  }

  private closeDialogOnOuterPressedDown(event: MouseEvent): void {
    this.pressedDownElement = event.target as HTMLElement;
  }

  private closeDialogOnOuterClick(event: MouseEvent): void {
    const dialog = document.getElementById("dialog") as HTMLDialogElement;
    if (event.target === dialog) {
      if (this.pressedDownElement === event.target) {
        dialog?.close();
      }
    }
    this.pressedDownElement = null;
  }
}
