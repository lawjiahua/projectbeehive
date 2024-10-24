import React, { useState } from 'react';
import { useParams, Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, CircularProgress , Breadcrumbs, Typography, Link} from '@mui/material';
// Import other components onc   e they are uncommented and used
import HoneyProductionComponent from '../components/HoneyProductionComponent';
import AnomalyDetectionComponent from '../components/AnomalyDetectionComponent';
import EnvironmentMonitoringComponent from '../components/EnvironmentMonitoringComponent';
import ComfortOfHiveComponent from '../components/ComfortOfHiveComponent';
import NectarAvailabilityComponent from '../components/NectarAvailabilityComponent';

interface FunctionComponentMap {
    [key: string]: React.ComponentType<any> | undefined;
}

const FunctionDetails = () => {
  const { beehiveName, functionName } = useParams<{ beehiveName: string; functionName?: string }>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  
  if (!functionName) {
    return <Navigate to="/" replace />;
  }

  // Component mapping with type annotation
  const functionComponents: FunctionComponentMap = {
    'Honey Production': HoneyProductionComponent,
    'Anomaly Detection': AnomalyDetectionComponent,
    'Availability of Nectar': NectarAvailabilityComponent,
    'Environment Monitoring': EnvironmentMonitoringComponent,
    'Comfort of Hive': ComfortOfHiveComponent
  };

  const decodedFunctionName = decodeURIComponent(functionName);
  const FunctionComponent = functionComponents[decodedFunctionName];

  if (!FunctionComponent) {
    return <div>No component available for this function</div>;
  }

  return (
    <div>
       {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      )}
      <Breadcrumbs aria-label='breadcrumb' sx={{ mt: 3 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
            Home
        </Link>
        <Link component={RouterLink} underline="hover" color="inherit" to={`/${beehiveName}`}>
            {beehiveName}
        </Link>
        <Typography>{decodedFunctionName}</Typography>
      </Breadcrumbs>
      <FunctionComponent beehiveName={beehiveName} setLoading={setLoading}/>
    </div>
  );
};

export default FunctionDetails;
