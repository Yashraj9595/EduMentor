import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect authenticated users to their appropriate dashboard
    switch (user.role) {
      case 'admin':
        return <Navigate to="/app/dashboard" replace />;
      case 'mentor':
      case 'student':
        return <Navigate to="/app/user-dashboard" replace />;
      default:
        return <Navigate to="/app/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
};