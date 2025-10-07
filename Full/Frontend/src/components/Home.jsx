import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Badge,
  Divider,
  Avatar,
  Rating
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Add,
  Remove,
  LocalOffer,
  Nature,
  Star,
  LocationOn,
  Timer,
  TrendingUp,
  FavoriteBorder,
  Share,
  Visibility,
  Category
} from '@mui/icons-material';
import { farmerAPI, userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await farmerAPI.getAllProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
      
      // Initialize quantities
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.stockItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to cart',
        severity: 'warning'
      });
      return;
    }

    try {
      const quantity = quantities[product.id] || 1;
      
      // Add to backend/localStorage
      await userAPI.addToCart(product.id, quantity);
      
      // Add to local cart context
      addToCart({
        ...product,
        quantity: quantity
      });
      
      setSnackbar({
        open: true,
        message: `${product.stockItem} added to cart successfully!`,
        severity: 'success'
      });
      
      // Reset quantity to 1 after adding
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1
      }));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add item to cart. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getImageUrl = (imagePath) => {
    // If imagePath is provided and looks like a URL, use it
    if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('https'))) {
      return imagePath;
    }
    // Otherwise return a fallback image
    return '/src/assets/react.svg';
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6">Loading fresh products...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              🌱 Fresh from Farm to Table
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              Discover the finest organic produce directly from local farmers. 
              Fresh, healthy, and sustainably grown just for you.
            </Typography>
            
            {/* Stats Section */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.9)' }}>
                  <Nature sx={{ fontSize: 40, color: 'green', mb: 1 }} />
                  <Typography variant="h6">100% Organic</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Certified organic products
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.9)' }}>
                  <LocationOn sx={{ fontSize: 40, color: 'blue', mb: 1 }} />
                  <Typography variant="h6">Local Farmers</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supporting local community
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.9)' }}>
                  <Timer sx={{ fontSize: 40, color: 'orange', mb: 1 }} />
                  <Typography variant="h6">Fresh Daily</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Harvested daily
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {error && (
          <Fade in={true}>
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Search Section */}
        <Fade in={true} timeout={1500}>
          <Paper sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <TextField
              fullWidth
              placeholder="🔍 Search for fresh products, categories, or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
          </Paper>
        </Fade>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product, index) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Zoom in={true} timeout={500 + index * 100}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={getImageUrl(product.imagePath)}
                      alt={product.stockItem}
                      onError={(e) => {
                        e.target.src = '/src/assets/react.svg';
                      }}
                      sx={{ 
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    
                    {/* Overlay badges */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      left: 12,
                      display: 'flex',
                      gap: 1
                    }}>
                      <Chip 
                        icon={<Nature />}
                        label="Organic" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(76, 175, 80, 0.9)', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    {/* Action buttons overlay */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.9)', 
                          '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                        }}
                      >
                        <FavoriteBorder />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.9)', 
                          '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                        }}
                      >
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      {product.stockItem}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        {product.farmer1?.firstname?.charAt(0) || 'F'}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        by {product.farmer1?.firstname} {product.farmer1?.lastname}
                      </Typography>
                    </Box>
                    
                    {product.category && (
                      <Chip 
                        icon={<Category />}
                        label={product.category.categoryName} 
                        size="small" 
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main'
                        }}
                      >
                        ₹{product.pricePerUnit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per unit
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.quantity} units
                      </Typography>
                      <Rating value={4.5} size="small" readOnly />
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 2, 
                        mb: 2,
                        p: 1,
                        bgcolor: 'rgba(0,0,0,0.05)',
                        borderRadius: 2
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(product.id, -1)}
                          disabled={quantities[product.id] <= 1}
                          sx={{ 
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                          }}
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="h6" sx={{ minWidth: '40px', textAlign: 'center' }}>
                          {quantities[product.id] || 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(product.id, 1)}
                          disabled={quantities[product.id] >= product.quantity}
                          sx={{ 
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(product)}
                        disabled={!isAuthenticated || product.quantity === 0}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 12px rgba(46, 125, 50, 0.3)'
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.12)'
                          }
                        }}
                      >
                        {!isAuthenticated ? 'Login to Add' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && !loading && (
          <Fade in={true}>
            <Paper sx={{ 
              p: 8, 
              textAlign: 'center', 
              mt: 4,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)'
            }}>
              <Search sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h4" gutterBottom color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search terms or browse all categories
              </Typography>
            </Paper>
          </Fade>
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
              fontWeight: 'bold'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Home;
