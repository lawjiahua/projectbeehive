import React, {  useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

import { BeehiveAlertResponse } from '../models/BeehiveAlertResponse';

const BeehiveDashboard = () => {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<BeehiveAlertResponse>({});

  useEffect(() => {
    if (user && user.beehives) {
      ApiService.getBeehiveAlerts(user.beehives)
        .then(setAlerts)
        .catch(console.error); // Handle errors more gracefully in production
    }
  }, [user]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Beehive Name</TableCell>
            <TableCell>Alert</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(alerts).map(([name, alert]) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row">
                <Link to={`/${name}`}>{name}</Link>
              </TableCell>
              <TableCell>{alert ? alert.alert_type : 'No alert'}</TableCell>
              <TableCell>{alert ? new Date(alert.timestamp).toLocaleString() : 'No timestamp available'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BeehiveDashboard;
