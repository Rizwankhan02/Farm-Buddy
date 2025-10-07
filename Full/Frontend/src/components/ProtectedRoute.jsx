import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Container } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false, sellerOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.isadmin) {
    return <Navigate to="/" replace />;
  }

  if (sellerOnly && user?.userType !== 'SELLER') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
