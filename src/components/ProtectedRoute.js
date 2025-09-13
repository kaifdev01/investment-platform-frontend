import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;