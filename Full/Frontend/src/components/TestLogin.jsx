import React, { useState } from 'react';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TestLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAdminLogin = () => {
    const adminData = {
      id: 1,
      firstname: 'Admin',
      lastname: 'Manager',
      email: 'admin@farmersmarket.com',
      userType: 'ADMIN',
      isadmin: true,
      phoneNo: '+1234567890',
      address: '123 Admin Office'
    };
    login(adminData);
    navigate('/admin');
  };

  const handleFarmerLogin = () => {
    const farmerData = {
      id: 2,
      firstname: 'John',
      lastname: 'Farmer',
      email: 'john@farmer.com',
      userType: 'FARMER',
      isadmin: false,
      phoneNo: '+1234567890',
      address: '123 Farm Street, Rural Area'
    };
    login(farmerData);
    navigate('/farmer');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Farmers Marketplace
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Choose Your Role
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    Admin Panel
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    <strong>Full Control:</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="ul" sx={{ pl: 2 }}>
                    <li>Add, update, and delete products</li>
                    <li>Manage farmer accounts</li>
                    <li>Track sales and records</li>
                    <li>System-wide settings</li>
                    <li>View analytics and reports</li>
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleAdminLogin}
                    sx={{ mt: 3 }}
                    size="large"
                  >
                    Login as Admin
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom color="success.main">
                    Farmer Portal
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    <strong>Shopping Experience:</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="ul" sx={{ pl: 2 }}>
                    <li>Browse available products</li>
                    <li>Add items to cart</li>
                    <li>Place and manage orders</li>
                    <li>Track purchase history</li>
                    <li>Update profile information</li>
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={handleFarmerLogin}
                    sx={{ mt: 3 }}
                    size="large"
                  >
                    Login as Farmer
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This marketplace operates with a simplified 2-role system:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              <strong>Admins</strong> handle all product management and business operations, while 
              <strong> Farmers</strong> focus on purchasing products they need for their farming activities.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Want to create your own account? <Link href="/register" style={{ color: '#2e7d32', textDecoration: 'none' }}>Register here</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TestLogin;
