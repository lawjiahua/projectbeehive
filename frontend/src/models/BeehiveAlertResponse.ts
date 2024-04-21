import { Alert } from './Alert';

export interface BeehiveAlertResponse {
    [beehiveName: string]: Alert | null; 
}