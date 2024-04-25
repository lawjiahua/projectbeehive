import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
// Import other components onc   e they are uncommented and used
import HoneyProductionComponent from '../components/HoneyProductionComponent';
import AnomalyDetectionComponent from '../components/AnomalyDetectionComponent';

interface FunctionComponentMap {
    [key: string]: React.ComponentType<any> | undefined;
}

const FunctionDetails = () => {
  const { beehiveName, functionName } = useParams<{ beehiveName: string; functionName?: string }>();
  const [loading, setLoading] = useState(true);
  
  if (!functionName) {
    return <Navigate to="/" replace />;
  }

  // Component mapping with type annotation
  const functionComponents: FunctionComponentMap = {
    'Honey Production': HoneyProductionComponent,
    'Anomaly Detection': AnomalyDetectionComponent,
    // 'Availability of Nectar': NectarAvailabilityComponent,
    // 'Environment Monitoring': EnvironmentMonitoringComponent,
    // 'Comfort of Hive': ComfortOfHiveComponent
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
      <h2>Details for {decodedFunctionName} in {beehiveName}</h2>
      <FunctionComponent beehiveName={beehiveName} setLoading={setLoading}/>
    </div>
  );
};

export default FunctionDetails;
