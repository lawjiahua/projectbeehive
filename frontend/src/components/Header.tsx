import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import HomeIcon from '@mui/icons-material/Home';

interface HeaderProps {
  username: string;
  avatarSrc: string; // URL to the user's avatar image
}

const Header: React.FC<HeaderProps> = ({ username, avatarSrc }) => {
  const navigate = useNavigate();
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
                <Avatar alt="User Avatar" src={avatarSrc} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{username}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
