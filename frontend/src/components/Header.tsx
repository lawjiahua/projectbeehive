import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Grid } from '@mui/material';

interface HeaderProps {
  username: string;
  avatarSrc: string; // URL to the user's avatar image
}

const Header: React.FC<HeaderProps> = ({ username, avatarSrc }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          {/* App Logo and Name */}
          <Grid item>
            <Typography variant="h6">My App</Typography>
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
