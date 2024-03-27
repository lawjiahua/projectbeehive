import { Alert } from "./Alert";
import { BeeActivityDataPoint } from "./BeeActivityDataPoint";
import { TemperatureDataPoint } from "./TemperatureDataPoint";
import { WeightDataPoint } from "./WeightDataPoint";

export interface IndividalBeehiveResponse {
    alerts: Alert[],
    beeActivityReadings: BeeActivityDataPoint[],
    temperatureReadings: TemperatureDataPoint[],
    weightReadings: WeightDataPoint[]
}