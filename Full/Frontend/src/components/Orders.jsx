import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Fade,
  Zoom,
  Badge,
  Tooltip,
  Button
} from '@mui/material';
import { 
  ShoppingBag as ShoppingBagIcon, 
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  Receipt,
  Visibility,
  Download,
  Timeline,
  TrendingUp,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material';
import { userAPI } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setError('Please log in to view your orders');
        return;
      }

      const response = await userAPI.getOrders(user.id);
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircleIcon sx={{ color: 'green' }} />;
      case 'shipped':
        return <ShippingIcon sx={{ color: 'blue' }} />;
      case 'processing':
        return <ScheduleIcon sx={{ color: 'orange' }} />;
      default:
        return <InventoryIcon sx={{ color: 'gray' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <ShoppingBagIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Loading your orders...</Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <Container maxWidth="sm">
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              backdropFilter: 'blur(10px)'
            }}
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
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
                  📋 Order History
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
                  Track your purchases and delivery status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    icon={<Timeline />}
                    label="Order Tracking" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<Receipt />}
                    label="Digital Receipts" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<ShippingIcon />}
                    label="Fast Delivery" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="body2">
                    Total Orders
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
                  </Typography>
                  <Typography variant="body2">
                    Total Spent
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {orders.length === 0 ? (
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
                <ShoppingBagIcon sx={{ 
                  fontSize: 120, 
                  color: 'primary.main', 
                  mb: 3,
                  opacity: 0.7
                }} />
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  No Orders Yet
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                  Your order history will appear here once you start shopping!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.location.href = '/'}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }
                  }}
                >
                  🛍️ Start Shopping
                </Button>
              </CardContent>
            </Card>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order, index) => (
              <Grid item xs={12} key={order.id}>
                <Zoom in={true} timeout={500 + index * 100}>
                  <Card sx={{ 
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      {/* Order Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3,
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: 'primary.main',
                            width: 60,
                            height: 60
                          }}>
                            {getStatusIcon(order.status)}
                          </Avatar>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Order #{order.id}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body1" color="text.secondary">
                                {formatDate(order.orderDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status)}
                            sx={{ 
                              mb: 2,
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              height: 32
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                            <AttachMoney sx={{ color: 'success.main' }} />
                            <Typography variant="h4" sx={{ 
                              fontWeight: 'bold',
                              color: 'success.main'
                            }}>
                              ₹{order.totalAmount.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Order Items Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Items Ordered
                        </Typography>
                        <Badge 
                          badgeContent={order.items?.length || 0} 
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          <InventoryIcon sx={{ color: 'primary.main' }} />
                        </Badge>
                      </Box>

                      {/* Order Items */}
                      <List sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 1 }}>
                        {order.items?.map((item, itemIndex) => (
                          <Fade in={true} timeout={700 + itemIndex * 100} key={itemIndex}>
                            <ListItem sx={{ 
                              mb: 1,
                              bgcolor: 'white',
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  bgcolor: 'success.main',
                                  width: 50,
                                  height: 50
                                }}>
                                  <InventoryIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mb: 1
                                  }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                      {item.productName}
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                      fontWeight: 'bold',
                                      color: 'success.main'
                                    }}>
                                      ₹{(item.quantity * item.pricePerUnit).toFixed(2)}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                      <Chip 
                                        label={`Qty: ${item.quantity}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                      <Chip 
                                        label={`₹${item.pricePerUnit.toFixed(2)} each`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                      />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>Category:</strong> {item.category} | <strong>Farmer:</strong> {item.farmerName}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          </Fade>
                        ))}
                      </List>

                      {/* Order Actions */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 2,
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                      }}>
                        <Tooltip title="View Order Details" arrow>
                          <Button 
                            variant="outlined" 
                            startIcon={<Visibility />}
                            sx={{ borderRadius: 2 }}
                          >
                            View Details
                          </Button>
                        </Tooltip>
                        <Tooltip title="Download Receipt" arrow>
                          <Button 
                            variant="contained" 
                            startIcon={<Download />}
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                              }
                            }}
                          >
                            Receipt
                          </Button>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Orders;
