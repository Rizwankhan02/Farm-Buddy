import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { sellerAPI } from '../services/api';

const DebugProducts = () => {
  const { user } = useContext(AuthContext);
  const [debugInfo, setDebugInfo] = useState({});

  const debugProductStorage = async () => {
    console.log('=== DEBUG PRODUCT STORAGE ===');
    
    // Check user data
    console.log('Current user:', user);
    console.log('User farmerId:', user?.farmerId);
    
    // Check localStorage
    const storedProducts = localStorage.getItem('mockProducts');
    const storedUser = localStorage.getItem('user');
    
    console.log('localStorage products:', storedProducts);
    console.log('localStorage user:', storedUser);
    
    // Parse localStorage data
    const parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
    console.log('Parsed products:', parsedProducts);
    console.log('Parsed user:', parsedUser);
    
    // Try to get products via API
    try {
      const apiResponse = await sellerAPI.getProducts(user?.farmerId || 1);
      console.log('API response:', apiResponse);
    } catch (error) {
      console.log('API error:', error);
    }
    
    setDebugInfo({
      user,
      farmerId: user?.farmerId,
      storedProducts: parsedProducts,
      storedUser: parsedUser,
      productsCount: parsedProducts.length,
      userProducts: parsedProducts.filter(p => p.farmerId == (user?.farmerId || 1))
    });
  };

  useEffect(() => {
    debugProductStorage();
  }, [user]);

  const clearStorage = () => {
    localStorage.removeItem('mockProducts');
    localStorage.removeItem('nextProductId');
    console.log('Cleared localStorage');
    debugProductStorage();
  };

  const addTestProduct = async () => {
    const testProduct = {
      stockItem: 'Debug Tomato',
      quantity: 10,
      pricePerUnit: 5.99,
      description: 'Test product for debugging',
      category: 'Vegetables'
    };
    
    try {
      const response = await sellerAPI.addProduct(user?.farmerId || 1, testProduct);
      console.log('Add product response:', response);
      debugProductStorage();
    } catch (error) {
      console.log('Add product error:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Product Storage Debug
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={debugProductStorage} sx={{ mr: 2 }}>
            Refresh Debug Info
          </Button>
          <Button variant="outlined" onClick={clearStorage} sx={{ mr: 2 }}>
            Clear Storage
          </Button>
          <Button variant="contained" color="secondary" onClick={addTestProduct}>
            Add Test Product
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Debug Information:</Typography>
        <Box component="pre" sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1,
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </Box>
      </Paper>
    </Container>
  );
};

export default DebugProducts;
