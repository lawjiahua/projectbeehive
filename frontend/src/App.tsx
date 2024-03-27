import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import LoginPage from './pages/LoginPage'; // Assuming you have a LoginPage component
import BeehivePage from './pages/BeehivePage';
import { Alert } from './models/Alert';
import { Beehive } from './models/Beehive';

// Sample data for demonstration
const alerts: Alert[] = [
  // Populate with Alert objects
  {
    message: "This is test alert",
    lastUpdate: new Date(),
    timeSinceStart: new Date()
  }
];

const beehives: Beehive[] = [
  {
    name: 'beehive1',
    lastUpdate: '2024-03-23T15:24:14.993704', // Yesterday
  },
  {
    name: 'beehive2',
    lastUpdate: '2024-03-17T15:24:14.993754', // One week ago
  }
];

const App: React.FC = () => {
  const isLoggedIn = true; // You would replace this with actual authentication logic
  const username = "John Doe"; // Replace with actual data
  const avatarSrc = "path/to/avatar.jpg"; // Replace with actual data

  return (
    <Router>
      {isLoggedIn && <Header username={username} avatarSrc={avatarSrc} />}
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
