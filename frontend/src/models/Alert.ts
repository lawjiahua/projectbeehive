export interface Alert {
  message: string;
  lastUpdate: Date; // Assuming ISO string format for simplicity
  timeSinceStart: Date; // Assuming ISO string format for simplicity
}
