import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Breadcrumbs, Link } from '@mui/material';

import ApiService from '../services/ApiService';
import { AlertData } from '../models/Alert';

interface MonitoringItem {
  function: string;
  status: JSX.Element;
  timestamp: string;
  iconPath: string;
}

const BeehiveDetails: React.FC = () => {
  const { beehiveName } = useParams();
  const [monitoringItems, setMonitoringItems] = useState<MonitoringItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
      ApiService.getOutstandingAlerts(beehiveName || 'beehive1')
          .then(alerts => mapAlertsToMonitoringFunctions(alerts))
          .then(items => {
              setMonitoringItems(items);
              setIsLoading(false);
          })
          .catch(err => {
              setError(err);
              setIsLoading(false);
          });
  }, [beehiveName]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Breadcrumbs aria-label='breadcrumb' sx={{ mt: 3, mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
            Home
        </Link>
        <Typography>{beehiveName}</Typography>
      </Breadcrumbs>
      <TableContainer component={Paper}>
        <Table aria-label="beehive details table">
          <TableHead>
            <TableRow>
              <TableCell>Monitoring Function</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monitoringItems.map((alert, index) => (
              <TableRow key={index}>
                <TableCell>
                  <RouterLink to={`/${beehiveName}/${encodeURIComponent(alert.function)}`}>
                  <img 
                    src={alert.iconPath} 
                    alt={`${alert.function} icon`} 
                    style={{ width: '28px', height: '28px', marginRight: 8, verticalAlign: 'middle' }}
                  />
                    {alert.function}
                  </RouterLink>
                </TableCell>
                <TableCell>{alert.status}</TableCell>
                <TableCell>{alert.timestamp}</TableCell>
              </TableRow>
            ))}
            {monitoringItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No monitoring data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapAlertsToMonitoringFunctions = (alerts: AlertData[]): MonitoringItem[] => {
  const functionMappings = {
      'low honey production': 'Honey Production',
      'sound anomaly': 'Anomaly Detection',
      'comfort': 'Comfort of Hive',
      'environment': 'Environment Monitoring',
      'nectar': 'Availability of Nectar'
  };

  const defaultMonitoringItems: MonitoringItem[] = Object.entries(functionMappings).map(([alertType, functionName]) => ({
      function: functionName,
      status: <span style={{ color: 'green' }}>&#10003; All good</span>,
      timestamp: '-',
      iconPath: `/functions/${functionName.replace(/ /g, '_').toLowerCase()}.png`
  }));

  alerts.forEach(alert => {
      const index = defaultMonitoringItems.findIndex(item => item.function === functionMappings[alert.alert_type as keyof typeof functionMappings]);
      if (index !== -1) {
          defaultMonitoringItems[index].status = <span style={{ color: 'red' }}>{alert.message}</span>;
          defaultMonitoringItems[index].timestamp = new Date(alert.date).toLocaleDateString();
      }
  });

  return defaultMonitoringItems;
};

export default BeehiveDetails;
