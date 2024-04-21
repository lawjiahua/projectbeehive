import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';  // Assuming your auth hook is properly typed

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
