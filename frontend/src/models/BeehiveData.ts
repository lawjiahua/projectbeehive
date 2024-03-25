export interface BeehiveData {
  date: string; // ISO date string
  weight: number;
  infraredReading: number;
  temperature: number;
}

export interface BeehiveAlert {
  id: string;
  message: string;
  date: string; // ISO date string
}
