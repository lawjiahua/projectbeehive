import React from 'react';
import { useParams } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box } from '@mui/material';

const BeehiveDetails = () => {
  let { beehiveName } = useParams();

  const drawerWidth = 240; // Adjust width as needed

  return (
    <Box sx={{ display: 'flex', pt: 8 }}> {/* Added padding top to compensate for AppBar height */}
       <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth, 
            boxSizing: 'border-box', 
            height: 'auto', 
            top: '64px' // Push down the drawer to start below the AppBar
          },
        }}
      >
        <List>
          {['Honey Production', 'Anomaly Detection', 'Availability of Nectar', 'Environment Monitoring', 'Comfort of Hive'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h2>{beehiveName}</h2>
        {/* Insert other components or content here */}
      </Box>
    </Box>
  );
};

export default BeehiveDetails;
