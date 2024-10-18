import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatTime",
  standalone: true,
})
export class FormatTimePipe implements PipeTransform {
  public transform(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid duration";
    }

    const totalMinutes = Math.floor(seconds);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  }
}
