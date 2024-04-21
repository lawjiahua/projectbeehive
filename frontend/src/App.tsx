import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import LoginPage from './pages/LoginPage'; // Assuming you have a LoginPage component
// import BeehivePage from './pages/BeehivePage';
import ApiService from './services/ApiService';
import BeehiveDetails from './pages/BeehiveDetails';
import ProtectedRoute from './ProtectedRoute';

// const AuthHandler: React.FC = () => {
//   const { setUser, setIsLoggedIn, token, isLoggedIn } = useUser();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!token) {
//       if (location.pathname !== '/login') {
//         console.log("Navigating to login because token is missing");
//         navigate('/login');
//       }
//     } else {
//       ApiService.fetchUserInfo(token)
//         .then(data => {
//           setUser(data);
//           setIsLoggedIn(true);
//           console.log("User data set, current path:", location.pathname);
//         })
//         .catch(error => {
//           console.error("Failed to fetch user info:", error);
//           if (error.message.includes('401')) {
//             localStorage.removeItem('loginToken');
//             if (location.pathname !== '/login') {
//               navigate('/login');
//             }
//           }
//         });
//     }
//   }, [token, setUser, setIsLoggedIn, navigate, location.pathname]);

//   useEffect(() => {
//     if (isLoggedIn && location.pathname === '/login') {
//       console.log("Redirecting to home because user is logged in");
//       navigate("/");
//     }
//   }, [isLoggedIn, navigate, location.pathname]);

//   return null; // This component does not render anything
// };

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
