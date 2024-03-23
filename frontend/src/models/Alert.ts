export interface Alert {
  id: string;
  message: string;
  lastUpdate: string; // Assuming ISO string format for simplicity
  timeSinceStart: string; // Assuming ISO string format for simplicity
}
