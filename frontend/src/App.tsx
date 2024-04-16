import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import { useUser } from './UserContext';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import LoginPage from './pages/LoginPage'; // Assuming you have a LoginPage component
import BeehivePage from './pages/BeehivePage';
import ApiService from './services/ApiService';

const AuthHandler: React.FC = () => {
  const { setUser, setIsLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('loginToken');
    if (!token) {
      navigate('/login');
    } else {
      ApiService.fetchUserInfo(token)
        .then(data => {
          setUser(data);
          setIsLoggedIn(true)
        })
        .catch(error => {
          console.error("Failed to fetch user info:", error);
          if (error.message.includes('401')) {
            localStorage.removeItem('loginToken');
            navigate('/login');
          }
        });
    }
  }, [setUser, navigate]);

  return null; // This component does not render anything
};

const App: React.FC = () => {
  const {isLoggedIn} = useUser()

  return (
    <Router>
      <AuthHandler />
      {isLoggedIn && <Header/>}
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
