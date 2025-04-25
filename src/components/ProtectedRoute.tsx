import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../context/authContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  
  if (!user) {
    // Redirect to login page, preserving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};