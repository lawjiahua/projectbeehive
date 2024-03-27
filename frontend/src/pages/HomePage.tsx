import React, {useEffect, useState} from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { Alert } from '../models/Alert';
import { Beehive } from '../models/Beehive';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

interface HomePageProps {
  alerts: Alert[];
  beehives: Beehive[];
}

const HomePage: React.FC = () => {
  const [beehives, setBeehives] = useState<Beehive[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beehiveData = await ApiService.fetchAllBeehives();
        setBeehives(beehiveData);
        const alertData = await ApiService.fetchAllAlerts();
        setAlerts(alertData);
      } catch (error) {
        console.error("Failed to fetch beehives:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
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

      {/* Beehives Section */}
      <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>Beehives</Typography>
      <TableContainer component={Paper} style={{ maxHeight: 200, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Last Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beehives.map((beehive, index) => (
              <TableRow key={index}>
                <TableCell><Link to={`/beehive/${beehive.name}`}>{beehive.name}</Link></TableCell>
                <TableCell>{formatDistanceToNow(new Date(beehive.lastUpdate), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HomePage;
