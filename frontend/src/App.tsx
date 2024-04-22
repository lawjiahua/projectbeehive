import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import LoginPage from './pages/LoginPage'; // Assuming you have a LoginPage component

import ApiService from './services/ApiService';
import BeehiveDetails from './pages/BeehiveDetails';
import ProtectedRoute from './ProtectedRoute';

const App: React.FC = () => {
  const {isLoggedIn} = useUser()

  return (
    <Router>
      {isLoggedIn && <Header/>}
        <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/:beehiveName" element={
            <ProtectedRoute>
              <BeehiveDetails />
            </ProtectedRoute>
          } />
        </Routes>
    </Router>
  );
};

export default App;
