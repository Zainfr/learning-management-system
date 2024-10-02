import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!token || !user) {
    // Redirect to login page if there's no token or user data
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if the user type matches the allowed roles
  if (!allowedRoles.includes(user.type)) {
    // Redirect to unauthorized page if user doesn't have permission
    return <Navigate to="/unauthorized" replace />;
  }

  // If everything is fine, render the protected component
  return children;
};

export default PrivateRoute;