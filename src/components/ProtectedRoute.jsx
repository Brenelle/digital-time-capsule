import { Navigate } from 'react-router-dom';
import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase';

export const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return  <Navigate to="/login" replace />;

  return children;
};
