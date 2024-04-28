import { HumidityDataPoint } from "./HumidityDataPoint";

export interface HumidityResponse {
    data?: HumidityDataPoint;
    error?: string;
}