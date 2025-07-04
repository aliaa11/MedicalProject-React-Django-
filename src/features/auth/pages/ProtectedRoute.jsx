import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;