export interface Alert {
  alert_type: string;
  timestamp: Date; // Assuming ISO string format for simplicity
  fileName: string;
  fileId: string;
  beehive: string;
}
