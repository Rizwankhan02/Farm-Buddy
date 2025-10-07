import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Grid,
  Divider,
  Snackbar,
  Avatar,
  Chip,
  Fade,
  Zoom,
  Tooltip,
  CardMedia,
  Badge
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCartCheckout,
  ShoppingCartOutlined,
  Store,
  LocalShipping,
  Security,
  MonetizationOn,
  PersonPin,
  Category,
  FavoriteBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart, createOrder } = useCart();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [serverCartItems, setServerCartItems] = useState([]);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    console.log('Cart items from context:', cartItems);
    console.log('Cart total:', cartTotal);
  }, [cartItems, cartTotal]);

  const handleRemoveItem = async (productId) => {
    try {
      await userAPI.removeFromCart(productId);
      removeFromCart(productId);
      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to remove item',
        severity: 'error'
      });
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'Your cart is empty',
        severity: 'warning'
      });
      return;
    }

    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to place an order',
        severity: 'warning'
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const order = await createOrder(user);
      setSnackbar({
        open: true,
        message: `Order #${order.id} placed successfully!`,
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to place order. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const calculateItemTotal = (item) => {
    return item.pricePerUnit * item.quantity;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Hero Header */}
        <Fade in={true} timeout={1000}>
          <Paper sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              opacity: 0.1,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.2"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20c0-11.046-8.954-20-20-20z"/%3E%3C/g%3E%3C/svg%3E")'
            }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🛒 Shopping Cart
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
                  Review your selected items and checkout
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    icon={<Security />}
                    label="Secure Checkout" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<LocalShipping />}
                    label="Free Delivery" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<MonetizationOn />}
                    label="Best Prices" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Paper sx={{
                  p: 2,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {cartItems.length}
                  </Typography>
                  <Typography variant="body2">
                    {cartItems.length === 1 ? 'Item' : 'Items'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {error && (
          <Fade in={true} timeout={1200}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {cartItems.length === 0 ? (
          <Fade in={true} timeout={1400}>
            <Card sx={{ 
              textAlign: 'center', 
              py: 8,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <ShoppingCartOutlined sx={{ 
                  fontSize: 120, 
                  color: 'primary.main', 
                  mb: 3,
                  opacity: 0.7
                }} />
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Your cart is empty
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                  Discover amazing products and add them to your cart
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/')}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                    }
                  }}
                >
                  🛍️ Start Shopping
                </Button>
              </CardContent>
            </Card>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <Fade in={true} timeout={1600}>
                <Paper sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  {/* Items Header */}
                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Cart Items ({cartItems.length})
                    </Typography>
                  </Box>

                  {/* Cart Items List */}
                  <Box sx={{ p: 2 }}>
                    {cartItems.map((item, index) => (
                      <Zoom in={true} timeout={500 + index * 100} key={item.id}>
                        <Card sx={{ 
                          mb: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3} alignItems="center">
                              {/* Product Image & Info */}
                              <Grid item xs={12} md={5}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 80, 
                                      height: 80,
                                      borderRadius: 2,
                                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)'
                                    }}
                                  >
                                    <Store sx={{ fontSize: 40 }} />
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      {item.stockItem}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                      <Chip 
                                        icon={<Category />}
                                        label={item.category?.categoryName || 'General'} 
                                        size="small" 
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </Box>
                                    {item.farmer1 && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonPin sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {item.farmer1.firstname} {item.farmer1.lastname}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Grid>

                              {/* Price */}
                              <Grid item xs={6} md={2}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Unit Price
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    ₹{item.pricePerUnit}
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Quantity Controls */}
                              <Grid item xs={6} md={2}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Quantity
                                  </Typography>
                                  <Paper sx={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center',
                                    borderRadius: 2,
                                    border: '1px solid rgba(0,0,0,0.1)'
                                  }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      sx={{ borderRadius: 1 }}
                                    >
                                      <Remove />
                                    </IconButton>
                                    <Typography 
                                      variant="h6" 
                                      sx={{ 
                                        minWidth: 40, 
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {item.quantity}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                      sx={{ borderRadius: 1 }}
                                    >
                                      <Add />
                                    </IconButton>
                                  </Paper>
                                </Box>
                              </Grid>

                              {/* Total */}
                              <Grid item xs={6} md={2}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Total
                                  </Typography>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                    ₹{calculateItemTotal(item).toFixed(2)}
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Actions */}
                              <Grid item xs={6} md={1}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Tooltip title="Remove from cart" arrow>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleRemoveItem(item.id)}
                                      sx={{
                                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                                        '&:hover': {
                                          bgcolor: 'rgba(244, 67, 54, 0.2)',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Zoom>
                    ))}
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} lg={4}>
              <Fade in={true} timeout={1800}>
                <Paper sx={{ 
                  p: 4,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  position: 'sticky',
                  top: 100
                }}>
                  {/* Summary Header */}
                  <Box sx={{ 
                    textAlign: 'center',
                    mb: 3,
                    p: 2,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                    borderRadius: 2,
                    color: 'white'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Order Summary
                    </Typography>
                  </Box>
                  
                  {/* Summary Details */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'rgba(0,0,0,0.05)',
                      borderRadius: 1,
                      mb: 2
                    }}>
                      <Typography variant="body1">
                        Items ({cartItems.length}):
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ₹{cartTotal.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      borderRadius: 1,
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShipping sx={{ color: 'success.main' }} />
                        <Typography variant="body1">Delivery:</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        FREE
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      borderRadius: 1,
                      mb: 3
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Total:
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        color: 'primary.main',
                        fontWeight: 'bold'
                      }}>
                        ₹{cartTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartCheckout />}
                      onClick={handlePlaceOrder}
                      disabled={loading || cartItems.length === 0}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #2E7D32, #1B5E20)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                        }
                      }}
                    >
                      {loading ? 'Processing...' : '🎉 Place Order'}
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => navigate('/')}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      🛍️ Continue Shopping
                    </Button>
                  </Box>

                  {/* Security Badge */}
                  <Box sx={{ 
                    mt: 3,
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'rgba(0,0,0,0.05)',
                    borderRadius: 1
                  }}>
                    <Security sx={{ color: 'success.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Secure checkout powered by industry-standard encryption
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              backdropFilter: 'blur(10px)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Cart;
