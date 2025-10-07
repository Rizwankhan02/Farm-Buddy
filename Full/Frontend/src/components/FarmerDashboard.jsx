import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Badge,
  IconButton,
  Paper,
  Breadcrumbs,
  Link,
  Fade,
  Zoom,
  Avatar,
  CardActions,
  Divider,
  Rating,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  FilterList as FilterIcon,
  LocalOffer as OfferIcon,
  Store as StoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  FavoriteBorder,
  Share,
  TrendingUp,
  Nature,
  LocalShipping,
  Category,
  Person
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { farmerAPI, sellerAPI } from '../services/api';

const FarmerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, addToCart, getCartItemCount } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await farmerAPI.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await sellerAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        id: product.id,
        stockItem: product.stockItem,
        pricePerUnit: product.pricePerUnit,
        quantity: 1,
        category: product.category,
        imagePath: product.imagePath
      };
      addToCart(cartItem);
      console.log('Added to cart:', product.stockItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.stockItem?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || product.category?.categoryName === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerUnit - b.pricePerUnit;
        case 'price-high':
          return b.pricePerUnit - a.pricePerUnit;
        case 'name':
        default:
          return a.stockItem?.localeCompare(b.stockItem) || 0;
      }
    });

  const cartItemCount = getCartItemCount();

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
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)', 
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
                  🌱 Welcome, {user?.firstname}!
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 2 }}>
                  Discover premium farming products from local suppliers
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    icon={<Nature />}
                    label="100% Organic" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<LocalShipping />}
                    label="Fast Delivery" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<TrendingUp />}
                    label="Best Prices" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Shopping Cart" arrow>
                  <IconButton 
                    color="inherit" 
                    onClick={() => window.location.href = '/cart'}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Badge 
                      badgeContent={cartItemCount} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#FF4444',
                          color: 'white',
                          fontWeight: 'bold'
                        }
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 28 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Breadcrumbs */}
        <Fade in={true} timeout={1200}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link color="inherit" href="/" sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}>
              Home
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>
              Marketplace
            </Typography>
          </Breadcrumbs>
        </Fade>

        {/* Search and Filters */}
        <Fade in={true} timeout={1400}>
          <Paper sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="🔍 Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.categoryName}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="price-low">Price (Low to High)</MenuItem>
                    <MenuItem value="price-high">Price (High to Low)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                  color: 'white',
                  borderRadius: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {filteredProducts.length}
                  </Typography>
                  <Typography variant="body2">
                    Products Found
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Loading premium products...</Typography>
            </Paper>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Zoom in={true} timeout={500 + index * 100}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={product.imagePath || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'}
                          alt={product.stockItem}
                          sx={{ 
                            objectFit: 'cover',
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
                          variant="h6" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 'bold',
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.stockItem}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2, 
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {product.description || 'Premium quality farming product sourced from trusted suppliers'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip 
                            icon={<Category />}
                            label={product.category?.categoryName || 'General'} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              borderColor: 'primary.main',
                              color: 'primary.main'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Stock: {product.quantity}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }}
                          >
                            ₹{product.pricePerUnit?.toFixed(2)}
                          </Typography>
                          <Rating value={4.5} size="small" readOnly />
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantity === 0}
                          startIcon={<ShoppingCartIcon />}
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
                          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Fade in={true}>
                  <Paper sx={{ 
                    p: 8, 
                    textAlign: 'center',
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.9)'
                  }}>
                    <SearchIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h4" gutterBottom color="text.secondary">
                      No Products Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Try adjusting your search terms or filters to find what you're looking for.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                        setSortBy('name');
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear Filters
                    </Button>
                  </Paper>
                </Fade>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FarmerDashboard;
