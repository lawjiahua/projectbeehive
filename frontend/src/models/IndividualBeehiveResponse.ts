import { AlertData } from "./Alert";
import { BeeActivityDataPoint } from "./BeeActivityDataPoint";
import { TemperatureDataPoint } from "./TemperatureDataPoint";
import { WeightDataPoint } from "./WeightDataPoint";

export interface IndividalBeehiveResponse {
    alerts: AlertData[],
    beeActivityReadings: BeeActivityDataPoint[],
    temperatureReadings: TemperatureDataPoint[],
    weightReadings: WeightDataPoint[]
}