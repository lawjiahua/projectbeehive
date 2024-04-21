import React, {useState} from 'react';
import { AppBar, Toolbar, Grid, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import HomeIcon from '@mui/icons-material/Home';

import { useUser } from '../UserContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {user, setToken, setIsLoggedIn, setUser} = useUser()

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    console.log('Logging out');
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    handleClose();
    navigate("/login")
  };

  const handleProfile = () => {
    // Navigate to profile page
    navigate('/profile');
    handleClose();
  };

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
            <IconButton onClick={handleMenu} color="inherit">
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Avatar alt="User Avatar" src={user.picture} />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">{user.name}</Typography>
                </Grid>
              </Grid>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
