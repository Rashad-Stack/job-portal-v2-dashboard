import React from 'react';
import { Navigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('svaAuth');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('svaAuth');
      return <Navigate to="/login" replace />;
    }

    // Check if admin role is required and user is not an admin
    if (requireAdmin && decoded.role !== 'ADMIN') {
      // Redirect to a "forbidden" page or home page
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
