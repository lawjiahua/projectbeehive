import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import HomeIcon from '@mui/icons-material/Home';

import { useUser } from '../UserContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const {user} = useUser()

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* App Logo and Name */}
          <Grid item>
          <IconButton onClick={() => navigate('/')} color="inherit">
              <HomeIcon /> {/* Home icon */}
              <Typography variant="h6" style={{ marginLeft: '10px' }}>Beehive monitoring</Typography>
            </IconButton>
          </Grid>
          {/* User Info */}
          <Grid item>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Avatar alt="User Avatar" src={user.picture} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{user.name}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
