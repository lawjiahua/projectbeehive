import { TemperatureDataPoint } from "./TemperatureDataPoint";

export interface TemperatureResponse {
    data?: TemperatureDataPoint;
    error?: string;
}