import React, {useEffect} from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'; 

import ApiService from '../services/ApiService';
import { useUser } from '../UserContext';

const LoginPage: React.FC = () => {
  const {setToken, setUser, setIsLoggedIn, isLoggedIn} = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if(isLoggedIn){
      navigate("/")
    }
  }, [])

  const handleLoginSuccess = async(response : any) => {
    console.log(response)
    try{
      const token = response?.credential;
      const data = await ApiService.loginWithGoogle(token);
      if(data.jwt){
        setToken(data.jwt)
        ApiService.fetchUserInfo(data.jwt)
          .then(data => {
            setUser(data);
            setIsLoggedIn(true);
            navigate("/")
          })
          .catch(error => {
            console.error("Failed to fetch user info:", error);
            if (error.message.includes('401')) {
                navigate('/login');
            }
          });
      }else{
        console.log("Token not received")
      }
    }catch(error){
      console.error('Error processing login:', error);
    }
  };

  const login = useGoogleLogin({onSuccess: handleLoginSuccess})

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
          src="/beekeeperLogo.png" // Replace with your logo path
          alt="App Logo"
          sx={{ width: 120, height: 120 }} // Adjust size as needed
        />

        {/* App Name */}
        <Typography variant="h4" component="h1" marginTop={2}>
         Bee Monitoring App
        </Typography>

        {/* Buttons */}
        <Box marginTop={4} width="100%" alignItems={'center'}>
          <div style={{ display: 'grid', placeItems: 'center', height: '10vh' }}>
            {/* <GoogleLogin 
              onSuccess={handleLoginSuccess}
              onError={() => console.log('Login Failed')}
            /> */}
            <Button variant='contained' onClick={() => login()}> Login/ Register with google</Button>
          </div>

        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
