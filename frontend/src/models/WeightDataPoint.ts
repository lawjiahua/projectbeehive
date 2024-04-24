export interface WeightDataPoint {
    reading : Float32Array;
    date: Date;
    timepoint: number;
    actualGain: Float32Array;
    projectedGain: Float32Array;
    beehive: string;
}