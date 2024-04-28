import { NectarPlotPoint } from "./NectarPlotPoint";

export interface NectarDataResponse {
    data: NectarPlotPoint[];
    error?: string;
}