export interface Alert {
  alert_type: string;
  date: Date; 
  fileId: string | null;
  beehive: string;
  message: string;
  status: string;
  id: string;
}
