import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser || !isAdmin) {
    // Strictly block non-admin and redirect to storefront root
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
