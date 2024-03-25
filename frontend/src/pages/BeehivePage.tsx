import React from 'react';
import { useParams } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { BeehiveData, BeehiveAlert } from '../models/BeehiveData';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';

// Assuming beehiveData and beehiveAlerts are populated with your data
// Static data for demonstration
const beehiveData: BeehiveData[] = [
  // Populate with data for the last 7 days
  {
    date: "2024-03-21T00:30:00.000+00:00",
    weight: 12.29,
    infraredReading: 30,
    temperature: 31.04
  },
  {
    date: "2024-03-22T00:30:00.000+00:00",
    weight: 12.49,
    infraredReading: 35,
    temperature: 29
  },
  {
    date: "2024-03-23T00:30:00.000+00:00",
    weight: 12.49,
    infraredReading: 35,
    temperature: 29
  },
  {
    date: "2024-03-24T00:30:00.000+00:00",
    weight: 12.49,
    infraredReading: 35,
    temperature: 29
  },
  {
    date: "2024-03-25T00:30:00.000+00:00",
    weight: 12.49,
    infraredReading: 35,
    temperature: 29
  },
  {
    date: "2024-03-26T00:30:00.000+00:00",
    weight: 12.49,
    infraredReading: 35,
    temperature: 29
  },
  {
    date: "2024-03-26T08:30:00.000+00:00",
    weight: 12.90,
    infraredReading: 55,
    temperature: 27
  },
  {
    date: "2024-03-27T00:30:00.000+00:00",
    weight: 12.49,
    infraredReading: 59,
    temperature: 29
  },
  {
    date: "2024-03-27T09:30:00.000+00:00",
    weight: 11.28,
    infraredReading: 72,
    temperature: 30
  },
];

const hAxisTicks = [
  new Date("2024-03-21T00:00:00.000+00:00"),
  new Date("2024-03-22T00:00:00.000+00:00"),
  new Date("2024-03-23T00:00:00.000+00:00"),
  new Date("2024-03-24T00:00:00.000+00:00"),
  new Date("2024-03-25T00:00:00.000+00:00"),
  new Date("2024-03-26T00:00:00.000+00:00"),
  new Date("2024-03-27T00:00:00.000+00:00"),
];

const beehiveAlerts: BeehiveAlert[] = [
  // Populate with any alerts for the beehive
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

  // Data for the charts
  const chartData = {
    weight: [['Date', 'Weight'], ...beehiveData.map(data => [new Date(data.date), data.weight])],
    infraredReading: [['Date', 'Infrared Reading'], ...beehiveData.map(data => [new Date(data.date), data.infraredReading])],
    temperature: [['Date', 'Temperature'], ...beehiveData.map(data => [formatDate(data.date), data.temperature])],
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
    <Container>
      <Typography variant="h4" gutterBottom>{name}</Typography>

      {/* Alerts Section */}
      {beehiveAlerts.map((alert, index) => (
        <Box key={index} mb={2}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography>{alert.message}</Typography>
          </Paper>
        </Box>
      ))}

      {/* Charts Section */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData.weight}
          options={{ ...options, title: 'Weight Over Time' }}
        />
        <Chart
          chartType="LineChart"
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
  );
};
export default BeehivePage;
