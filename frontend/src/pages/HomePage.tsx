import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { Alert } from '../models/Alert';
import { Beehive } from '../models/Beehive';

interface HomePageProps {
  alerts: Alert[];
  beehives: Beehive[];
}

const HomePage: React.FC<HomePageProps> = ({ alerts, beehives }) => {
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
              <TableCell>Time Since Start</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.message}</TableCell>
                <TableCell>{alert.lastUpdate}</TableCell>
                <TableCell>{alert.timeSinceStart}</TableCell>
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
                <TableCell>{beehive.name}</TableCell>
                <TableCell>{beehive.lastUpdate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HomePage;
