import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Alert, Button, CircularProgress, Grid } from '@mui/material';
import { Chart } from 'react-google-charts';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatRelative, parseISO } from 'date-fns'

import { AlertData } from '../models/Alert';
import ApiService from '../services/ApiService';  
import { SoundData } from '../models/SoundData';
import { HumidityDataPoint } from '../models/HumidityDataPoint';
import { HumidityResponse } from '../models/HumidityResponse';
import { TemperatureResponse } from '../models/TemperatureResponse';

interface AnomalyDetectionProps {
    beehiveName: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const ComfortOfHiveComponent: React.FC<AnomalyDetectionProps> = ({ beehiveName, setLoading }) => {
    const [alert, setAlert] = useState<AlertData | null>(null);
    const [chartData, setChartData] = useState<Array<Array<number | string>>>([['Time', 'Amplitude']]);
    const [humidityReading, setHumidityReading] = useState<number>(70.0)
    const [temperatureReading, setTemperatureReading] = useState<number>(30.0)
    const [loadingChart, setLoadingChart] = useState<boolean>(true)
    const [normalSoundId, setNormalSoundId] = useState<string>('10Eko1qj0oAorS52ATiXtq1D2MBVJxSbM')
    const [normalChartData, setNormalChartData] = useState<Array<Array<number | string>>>([['Time', 'Amplitude']]);

    useEffect(() => {
        setLoading(true);
        ApiService.fetchAlertsForBeehiveFunction(beehiveName, 'Comfort of Hive').then((alertsData) => {
            const activeAlert = alertsData.find(alert => alert.status === 'active');
            setAlert(activeAlert);
            if (activeAlert?.fileId) {
                ApiService.fetchSoundData(activeAlert.fileId).then((soundFileData: SoundData[]) => {
                    const formattedData: Array<Array<number | string>> = [['Time', 'Amplitude'], ...soundFileData.map(item => [item.Time, item.Amplitude])];
                    setLoading(false)
                    setChartData(formattedData);
                    setLoadingChart(false);
                }).catch(error => {
                    setLoading(false)
                    console.error("Failed to load sound data:", error);
                    setLoadingChart(false);
                });
            } else {
                ApiService.fetchSoundData(normalSoundId).then((soundFileData: SoundData[]) => {
                    const formattedData: Array<Array<number | string>> = [['Time', 'Amplitude'], ...soundFileData.map(item => [item.Time, item.Amplitude])];
                    setLoading(false)
                    setNormalChartData(formattedData);
                    setLoadingChart(false);
                }).catch(error => {
                    setLoading(false)
                    console.error("Failed to load sound data:", error);
                    setLoadingChart(false);
                });
            }

            ApiService.getHumidityStatus(beehiveName).then((humidityResponse : HumidityResponse) => {
                if(humidityResponse.data){
                    setHumidityReading(humidityResponse.data.reading);
                }

                ApiService.getTemperatureStatus(beehiveName).then((temperatureResponse: TemperatureResponse) => {
                    if(temperatureResponse.data){
                        setTemperatureReading(temperatureResponse.data.reading);
                        setLoading(false);
                    }
                })
            })


        }).catch(error => {
            console.error("Failed to load alerts:", error);
            setLoading(false);
        });
    }, [beehiveName, setLoading]);

    const handleResolveAlert = async (alertId: string) => {
        try {
            await ApiService.resolveAlert(alertId);
            setAlert(null);
        } catch (error) {
            console.error("Error resolving alert:", error);
        }
    };

    const determineStatus = () => {
        if(alert){
            return { text: 'High', color: 'red' };
        } else {
            return { text: 'Normal', color: 'green' };
        }
    };

    const options = {
        hAxis: {
            title: 'Time',
            format: 'decimal',
            viewWindowMode: 'explicit',
            viewWindow: {
                min: chartData.length > 1 ? parseFloat(chartData[1][0] as string) : 0,
                max: chartData.length > 1 ? parseFloat(chartData[chartData.length - 1][0] as string) : 0
            },
            ticks: chartData.length > 1 ? [parseFloat(chartData[1][0] as string), parseFloat(chartData[chartData.length - 1][0] as string)] : [0]
        },
        vAxis: {
            title: 'Amplitude',
            viewWindowMode: 'explicit',
            viewWindow: {
                min: Math.min(...chartData.slice(1).map(row => row[1] as number)),
                max: Math.max(...chartData.slice(1).map(row => row[1] as number))
            },
            ticks: [
                Math.min(...chartData.slice(1).map(row => row[1] as number)),
                Math.max(...chartData.slice(1).map(row => row[1] as number))
            ]
        },
        legend: { position: 'none' }
    };

    const normalSoundChartOptions = {
        hAxis: {
            title: 'Time',
            format: 'decimal',
            viewWindowMode: 'explicit',
            viewWindow: {
                min: normalChartData.length > 1 ? parseFloat(normalChartData[1][0] as string) : 0,
                max: normalChartData.length > 1 ? parseFloat(normalChartData[normalChartData.length - 1][0] as string) : 0
            },
            ticks: normalChartData.length > 1 ? [parseFloat(normalChartData[1][0] as string), parseFloat(normalChartData[normalChartData.length - 1][0] as string)] : [0]
        },
        vAxis: {
            title: 'Amplitude',
            viewWindowMode: 'explicit',
            viewWindow: {
                min: Math.min(...normalChartData.slice(1).map(row => row[1] as number)),
                max: Math.max(...normalChartData.slice(1).map(row => row[1] as number))
            },
            ticks: [
                Math.min(...normalChartData.slice(1).map(row => row[1] as number)),
                Math.max(...normalChartData.slice(1).map(row => row[1] as number))
            ]
        },
        legend: { position: 'none' }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}> {/* Added styles */}
                <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Comfort of Hive Details for {beehiveName}
                </Typography>

                {alert ? (
                    <Alert severity="error" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon sx={{ mr: 2 }} />
                    <div>
                        <Typography variant="body1">{alert.message}</Typography>
                        <Typography variant="caption">
                        {formatRelative(alert.date, new Date())}
                        </Typography>
                        <Button onClick={() => handleResolveAlert(alert._id)} sx={{ ml: 2 }}>
                        Resolve
                        </Button>
                    </div>
                    </Alert>
                ) : (
                    <Alert severity="success" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 2 }} />
                    <Typography variant="body1">No anomaly detected. Bees are in good condition.</Typography>
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ my: 2 }}>
                    <Grid item xs={6}>
                        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">Temperature:</Typography>
                            <Box sx={{ color: temperatureReading ? determineStatus().color : 'inherit' }}>
                                <Typography variant="h5">
                                    {temperatureReading ? determineStatus().text : 'Loading...'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">Humidity:</Typography>
                            <Box sx={{ color: humidityReading ? determineStatus().color : 'inherit' }}>
                                <Typography variant="h5">
                                    {humidityReading ? determineStatus().text : 'Loading...'}
                                </Typography>
                            </Box>
                        </Paper>
                        
                    </Grid>
                </Grid>

                {alert && chartData.length > 0 && (
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6">Sound Data Plot</Typography>
                        {/* Implementation of sound data plotting will depend on the format of soundData */}
                        {loadingChart? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={chartData}
                                options={options}
                            />
                        )}
                    </Paper>
                )}

                {!alert && normalChartData.length > 0 &&(
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6">Sound Data Plot</Typography>
                        {/* Implementation of sound data plotting will depend on the format of soundData */}
                        {loadingChart? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={normalChartData}
                                options={normalSoundChartOptions}
                            />
                        )}
                    </Paper>
                )}
                </Box>
            </Box>
            </Container>
    );
};

export default ComfortOfHiveComponent;