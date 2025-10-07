import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { sellerAPI } from '../services/api';

const SimpleProductTest = () => {
  const { user } = useContext(AuthContext);
  const [testResult, setTestResult] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    stockItem: 'Test Tomato',
    quantity: '10',
    pricePerUnit: '5.99',
    category: 'Vegetables',
    description: 'Test product'
  });

  const clearLocalStorage = () => {
    localStorage.removeItem('mockProducts');
    localStorage.removeItem('nextProductId');
    setTestResult('LocalStorage cleared!');
    setProducts([]);
  };

  const addTestProduct = async () => {
    try {
      console.log('Starting product addition test...');
      console.log('Current user:', user);
      
      if (!user || !user.farmerId) {
        setTestResult('ERROR: No user or farmerId found! Please login first.');
        return;
      }

      const productData = {
        stockItem: newProduct.stockItem,
        quantity: parseInt(newProduct.quantity),
        pricePerUnit: parseFloat(newProduct.pricePerUnit),
        category: { categoryName: newProduct.category },
        description: newProduct.description
      };

      console.log('Adding product with farmerId:', user.farmerId);
      console.log('Product data:', productData);

      const response = await sellerAPI.addProduct(user.farmerId, productData);
      console.log('Add product response:', response);

      setTestResult(`SUCCESS: Product added! Response: ${JSON.stringify(response.data, null, 2)}`);
      
      // Immediately try to retrieve products
      await getProducts();
      
    } catch (error) {
      console.error('Error adding product:', error);
      setTestResult(`ERROR: ${error.message}`);
    }
  };

  const getProducts = async () => {
    try {
      console.log('Getting products for farmerId:', user?.farmerId);
      
      if (!user || !user.farmerId) {
        setTestResult('ERROR: No user or farmerId found!');
        return;
      }

      const response = await sellerAPI.getProducts(user.farmerId);
      console.log('Get products response:', response);
      
      setProducts(response.data || []);
      setTestResult(`Retrieved ${response.data?.length || 0} products for farmer ${user.farmerId}`);
      
    } catch (error) {
      console.error('Error getting products:', error);
      setTestResult(`ERROR getting products: ${error.message}`);
    }
  };

  const checkLocalStorage = () => {
    const storedProducts = localStorage.getItem('mockProducts');
    const storedUser = localStorage.getItem('user');
    const nextId = localStorage.getItem('nextProductId');
    
    const result = {
      products: storedProducts ? JSON.parse(storedProducts) : null,
      user: storedUser ? JSON.parse(storedUser) : null,
      nextId: nextId
    };
    
    setTestResult(`LocalStorage contents:\n${JSON.stringify(result, null, 2)}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Product Addition Test
        </Typography>

        {user ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Logged in as: {user.firstname} {user.lastname} (farmerId: {user.farmerId})
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            Not logged in! Please go to <a href="/test-login">/test-login</a> first.
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Test Product Data:</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label="Product Name"
              value={newProduct.stockItem}
              onChange={(e) => setNewProduct({...newProduct, stockItem: e.target.value})}
              size="small"
            />
            <TextField
              label="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
              size="small"
            />
            <TextField
              label="Price"
              value={newProduct.pricePerUnit}
              onChange={(e) => setNewProduct({...newProduct, pricePerUnit: e.target.value})}
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={addTestProduct} sx={{ mr: 2 }}>
            Add Test Product
          </Button>
          <Button variant="outlined" onClick={getProducts} sx={{ mr: 2 }}>
            Get Products
          </Button>
          <Button variant="outlined" onClick={checkLocalStorage} sx={{ mr: 2 }}>
            Check LocalStorage
          </Button>
          <Button variant="outlined" color="error" onClick={clearLocalStorage}>
            Clear Storage
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Test Result:</Typography>
        <Box component="pre" sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1,
          fontSize: '0.875rem',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {testResult || 'No test run yet'}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Retrieved Products ({products.length}):</Typography>
        {products.length > 0 ? (
          products.map((product, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{product.stockItem}</Typography>
                <Typography>Quantity: {product.quantity}</Typography>
                <Typography>Price: ${product.pricePerUnit}</Typography>
                <Typography>Category: {product.category?.categoryName || 'N/A'}</Typography>
                <Typography>Farmer ID: {product.farmerId}</Typography>
                <Typography>Product ID: {product.id}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary">No products found</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SimpleProductTest;
