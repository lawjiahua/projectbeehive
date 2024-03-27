import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import LoginPage from './pages/LoginPage'; // Assuming you have a LoginPage component
import BeehivePage from './pages/BeehivePage';
import ApiService from './services/ApiService';

const App: React.FC = () => {
  // const isLoggedIn = true; // You would replace this with actual authentication logic
  const fakeusername = "Leong"; // Replace with actual data
  const avatarSrc = "path/to/avatar.jpg"; // Replace with actual data
  const [username, setUsername] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await ApiService.fetchUserInfo()
        // Assuming `data` contains fields like `username` and `avatarSrc`
        setUsername(response.name);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchUserInfo();
  }, []);
  
  return (
    <Router>
      {isLoggedIn && <Header username={username as string} avatarSrc={avatarSrc} />}
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
