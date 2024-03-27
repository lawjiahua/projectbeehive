import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { BeeActivityDataPoint } from '../models/BeeActivityDataPoint';
import { Alert } from '../models/Alert';
import { WeightDataPoint } from '../models/WeightDataPoint';
import { TemperatureDataPoint } from '../models/TemperatureDataPoint';
import ApiService from '../services/ApiService';
import { formatDistanceToNow } from 'date-fns';

const hAxisTicks = [
  new Date("2024-03-21T00:00:00.000+00:00"),
  new Date("2024-03-22T00:00:00.000+00:00"),
  new Date("2024-03-23T00:00:00.000+00:00"),
  new Date("2024-03-24T00:00:00.000+00:00"),
  new Date("2024-03-25T00:00:00.000+00:00"),
  new Date("2024-03-26T00:00:00.000+00:00"),
  new Date("2024-03-27T00:00:00.000+00:00"),
];

export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
};

const BeehivePage: React.FC = () => {
  let { name } = useParams<{ name: string }>();
  const [beeActivityReadings, setBeeActivityReadings] = useState<BeeActivityDataPoint[]>([]) 
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [weightReadings, setWeightReadings] = useState<WeightDataPoint[]>([])
  const [temperatureReadings, setTemperatureReadings] = useState<TemperatureDataPoint[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beehiveData = await ApiService.fetchIndividualBeehiveData(name as string)
        setBeeActivityReadings(beehiveData.beeActivityReadings)
        setTemperatureReadings(beehiveData.temperatureReadings)
        setAlerts(beehiveData.alerts)
        setWeightReadings(beehiveData.weightReadings)
        console.log(beehiveData)
      } catch (error) {
        console.error("Failed to fetch beehives data:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchData() 
  }, [])

  // Data for the charts
  const chartData = {
    weight: [['Date', 'Weight'], ...weightReadings.map(data => [new Date(data.timestamp), data.reading])],
    infraredReading: [['Date', 'Infrared Reading'], ...beeActivityReadings.map(data => [new Date(data.timestamp), data.reading])],
    temperature: [['Date', 'Temperature'], ...temperatureReadings.map(data => [new Date(data.timestamp), data.reading])],
  };

  // Chart options
  const options = {
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: {
      format: 'd/M/yy', // Format the horizontal axis labels
      ticks: hAxisTicks
    },
  };

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Container>
            <Typography variant="h4" gutterBottom>{name}</Typography>
            <div style={{ marginBottom: '20px' }}>
              {/* Alerts Section */}
              <Typography variant="h6" style={{ marginBottom: '10px' }}>Alerts</Typography>
              <TableContainer component={Paper} style={{ maxHeight: 200, overflow: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Message</TableCell>
                      <TableCell>Last Update</TableCell>
                      {/* <TableCell>Time Since Start</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map((alert, index) => (
                      <TableRow key={index}>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>{formatDistanceToNow(alert.lastUpdate)}</TableCell>
                        {/* <TableCell>{formatDistanceToNow(alert.timeSinceStart)}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Charts Section */}
            <Typography variant="h6" style={{ marginBottom: '10px' }}>Beehive Data </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={chartData.weight}
                options={{ ...options, title: 'Weight Over Time' }}
              />
              <Chart
                chartType="ScatterChart"
                width="100%"
                height="400px"
                data={chartData.infraredReading}
                options={{ ...options, title: 'Infrared Reading Over Time' }}
              />
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={chartData.temperature}
                options={{ ...options, title: 'Temperature Over Time' }}
              />
            </Paper>
          </Container>
        </div>
      )}
    </div>
  );
};
export default BeehivePage;
