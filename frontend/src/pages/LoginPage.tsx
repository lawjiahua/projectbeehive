import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    // Implement login logic here
    console.log('Login');
  };

  const handleRegister = () => {
    // Implement register logic here
    console.log('Register');
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        {/* App Logo */}
        <Box
          component="img"
          src="/path-to-your-logo.png" // Replace with your logo path
          alt="App Logo"
          sx={{ width: 120, height: 120 }} // Adjust size as needed
        />

        {/* App Name */}
        <Typography variant="h4" component="h1" marginTop={2}>
          My App
        </Typography>

        {/* Buttons */}
        <Box marginTop={4} width="100%">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ marginBottom: 2 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
