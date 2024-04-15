import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import { useUser } from './UserContext';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import LoginPage from './pages/LoginPage'; // Assuming you have a LoginPage component
import BeehivePage from './pages/BeehivePage';
import ApiService from './services/ApiService';

const App: React.FC = () => {
  const isLoggedIn = true; // You would replace this with actual authentication logic
  const fakeusername = "Leong"; // Replace with actual data
  const avatarSrc = "path/to/avatar.jpg"; // Replace with actual data
  const [username, setUsername] = useState<string>();
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const { setUser } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // No token found, redirect to login page
      navigate('/login');
    } else {
      ApiService.fetchUserInfo(token)
        .then(data => {
          setUser(data); // Set user data in context
        })
        .catch(error => {
          console.error("Failed to fetch user info:", error);
          if (error.message.includes('401')) { // Customize the error message check as needed
            localStorage.removeItem('jwtToken');
            navigate('/login');
          }
        });
    }
  }, [setUser, navigate]);
  
  return (
    <Router>
      {isLoggedIn && <Header username={fakeusername as string} avatarSrc={avatarSrc} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Routes>
        <Route path="/beehive/:name" element={<BeehivePage />} />
      </Routes>
    </Router>
  );
};

export default App;
