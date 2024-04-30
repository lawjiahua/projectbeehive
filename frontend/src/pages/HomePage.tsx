import React, {  useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import ApiService from '../services/ApiService'; // Adjust the import path as necessary
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
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
            <TableCell>
              <Typography variant='h6'>
                Beehive Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h6'>
                Alert
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(alerts).map(([name, alertCount]) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row">
                <img 
                  src={'/functions/comfort_of_hive.png'} 
                  alt={`beehive`} 
                  style={{ width: '28px', height: '28px', marginRight: 8, verticalAlign: 'middle' }}
                />
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
