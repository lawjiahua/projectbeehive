import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import ApiService from '../services/ApiService';
import { useUser } from '../UserContext';

const LoginPage: React.FC = () => {
  const {setToken} = useUser()

  const handleLoginSuccess = async(response : any) => {
    try{
      console.log(response)
      const token = response?.credential;
      const data = await ApiService.loginWithGoogle(token);
      if(data.jwt){
        setToken(data.jwt)
        console.log("Token received")
      }else{
        console.log("Token not received")
      }
    }catch(error){
      console.error('Error processing login:', error);
    }
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
          src="../../../public/beekeeperLogo.png" // Replace with your logo path
          alt="App Logo"
          sx={{ width: 120, height: 120 }} // Adjust size as needed
        />

        {/* App Name */}
        <Typography variant="h4" component="h1" marginTop={2}>
         Bee Monitoring App
        </Typography>

        {/* Buttons */}
        <Box marginTop={4} width="100%">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
