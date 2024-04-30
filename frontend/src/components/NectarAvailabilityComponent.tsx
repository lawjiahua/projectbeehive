import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';  // Ensure this service is also using TypeScript
import { Chart } from 'react-google-charts';
import { Typography, Paper, TextField, Box, Container, Alert, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { formatRelative, parseISO } from 'date-fns';

// import { WeightDataPoint } from '../models/WeightDataPoint';
import { AlertData } from '../models/Alert';


interface NectarAvailabilityProps {
    beehiveName: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // getMonth returns 0-11, so add 1 for 1-12
    const day = date.getDate();

    // Pad the month and day with a leading zero if they are less than 10
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();

    return `${year}-${formattedMonth}-${formattedDay}`;
};

const NectarAvailabilityComponent: React.FC<NectarAvailabilityProps> = ({ beehiveName, setLoading }) => {
    const [chartData, setChartData] = useState<Array<(string | number)[]>>([['Weight', 'Infrared Reading']]);
    const [alert, setAlert] = useState<AlertData | null>(null);
    // const [queryDate, setQueryDate] = useState<string>('2024-04-20')
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ApiService.fetchAlertsForBeehiveFunction(beehiveName, 'Availability of Nectar').then((alertsData) => {
            const activeAlert = alertsData.find(alert => alert.status === 'active');
            setAlert(activeAlert);
            ApiService.fetchNectarData(beehiveName).then(response => { 
                if (response.data && response.data.length > 0) {
                    // Prepare data specifically for plotting
                    const formattedData = response.data.map(item => [
                        item.infraredReading, 
                        item.actualGain,
                        // 0.1224 *  Number(item.actualGain)
                    ]);
                    setChartData([['Infrared Reading', 'Weight'], ...formattedData]);
                } else {
                    setError('No data available');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch data');
                setLoading(false);
            });
        })
    }, [beehiveName, setLoading]);

    const handleResolveAlert = async (alertId: string) => {
        try {
            await ApiService.resolveAlert(alertId);
            setAlert(null);
        } catch (error) {
            console.error("Error resolving alert:", error);
        }
    };

    const options = {
        title: 'Weight / Traffic',
        hAxis: { title: 'Traffic' },
        vAxis: { title: 'Weight' },
        seriesType: 'scatter',
        series: {
            0: { pointSize: 5, color: 'blue' },
        },
        legend: 'bottom',
        trendlines: { 0: {} }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Nectar Availability Details for {beehiveName}
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
                        <Typography variant="body1">Beehive nectar levels are good.</Typography>
                    </Alert>
                )}

                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6">Nectar / Traffic graph</Typography>
                    {/* <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={{
                            title: 'Weight vs. Infrared Reading',
                            hAxis: { title: 'Traffic', format: 'decimal' },
                            vAxis: { title: 'Nectar Weight gain (kg)', format: 'decimal' },
                            legend: 'bottom',
                            series: {
                                0: { pointSize: 5, color: 'blue' },
                                1: { lineWidth: 2, color: 'green', visibleInLegend: true, labelInLegend: 'Best Fit' }
                            },
                        }}
                    /> */}
                    <Chart
                        chartType="ComboChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={options}
                    />
                </Paper>

                {/* <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6">Filter Data</Typography>
                    <TextField
                        label="Filter From Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        sx={{ mt: 2, mb: 2, width: '100%' }}
                    />
                </Paper> */}
            </Box>
        </Container>
    );
};

export default NectarAvailabilityComponent;
