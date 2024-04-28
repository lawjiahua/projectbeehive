import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';  // Ensure this service is also using TypeScript
import { Chart } from 'react-google-charts';
import { Typography, Paper, TextField, Box, Container, Alert, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { formatRelative, parseISO } from 'date-fns';

import { WeightDataPoint } from '../models/WeightDataPoint';
import { AlertData } from '../models/Alert';


interface HoneyProductionProps {
    beehiveName: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HoneyProductionComponent: React.FC<HoneyProductionProps> = ({ beehiveName, setLoading }) => {
    const [weights, setWeights] = useState<Array<Array<string | Float32Array>>>([]);
    const [alerts, setAlerts] = useState<AlertData[]>([]);

    useEffect(() => {
        ApiService.fetchWeightsForBeehive(beehiveName).then((data: WeightDataPoint[]) => {
            var datapoints = data.map(weight => [
                new Date(weight.date).toLocaleDateString(),  // Format date
                weight.actualGain,                       // Assume the first element is the relevant gain
                weight.projectedGain                     // Assume the first element is the relevant gain
            ])
            setWeights(datapoints);

            ApiService.fetchAlertsForBeehiveFunction(beehiveName, 'Honey Production').then((alertsData) => {
                setAlerts(alertsData);
                setLoading(false);
             }).catch(error => {
                console.error("Failed to fetch alerts:", error);
            }).catch(error => {
                console.error("Failed to fetch weights:", error);
            });
        });
    }, [beehiveName, setLoading]);

    const handleResolveAlert = async (alertId: string) => {
        try {
            await ApiService.resolveAlert(alertId);
            // Optionally refresh alerts or remove the resolved alert from the state
            setAlerts(prev => prev.filter(alert => alert._id !== alertId));
        } catch (error) {
            console.error("Error resolving alert:", error);
            // Handle errors (e.g., display a notification or message to the user)
        }
    };

    const latestActiveAlert = alerts.find(alert => alert.status === 'active');

    const options = {
        title: 'Honey Production Gains',
        hAxis: { title: 'Date', format: 'M/d/yy' },
        vAxis: { title: 'Gain (kg)' },
        series: {
            0: { color: '#e2431e' },  // Actual Gain
            1: { color: '#0a4fcf' }   // Projected Gain
        },
        legend: { position: 'bottom' }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Honey Production Details for {beehiveName}
                </Typography>

                {latestActiveAlert ? (
                    <Alert severity="error" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WarningIcon sx={{ mr: 2 }} />
                        <div>
                            <Typography variant="body1">{latestActiveAlert.message}</Typography>
                            <Typography variant="caption">
                                {formatRelative(latestActiveAlert.date, new Date())}
                            </Typography>
                            <Button onClick={() => handleResolveAlert(latestActiveAlert._id)} sx={{ ml: 2 }}>
                                Resolve
                            </Button>
                        </div>
                    </Alert>
                ) : (
                    <Alert severity="success" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ mr: 2 }} />
                        <Typography variant="body1">Honey production levels are normal.</Typography>
                    </Alert>
                )}

                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">Actual gain / Projected gain graph</Typography>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="200px"
                        data={[['Date', 'Actual Gain', 'Projected Gain'], ...weights]}
                        options={options}
                    />
                </Paper>

                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6">Filter Data</Typography>
                    {/* <TextField
                        label="Filter From Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        sx={{ mt: 2, mb: 2, width: '100%' }}
                    /> */}
                </Paper>
            </Box>
        </Container>
    );
};

export default HoneyProductionComponent;
