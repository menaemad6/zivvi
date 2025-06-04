import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // or a loading spinner
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default PrivateRoute; 