import React, {  useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

import { BeehiveAlertResponse } from '../models/BeehiveAlertResponse';
import './Pages.css';

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
            <TableCell>Alerts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(alerts).map(([name, alertCount]) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row">
                <Link to={`/${name}`}>{name}</Link>
              </TableCell>
              <TableCell>
                {alertCount > 0 ? (
                  <span className="alertCount">{alertCount}</span>
                ) : (
                  <span className="goodCondition">Beehive in good condition</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BeehiveDashboard;
