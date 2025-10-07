import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { sellerAPI } from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    stockItem: '',
    quantity: '',
    pricePerUnit: '',
    category: '',
    imagePath: '',
    description: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`, typeof value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Product name validation
    if (!formData.stockItem || formData.stockItem.trim() === '') {
      newErrors.stockItem = 'Product name is required';
    } else if (formData.stockItem.length < 3) {
      newErrors.stockItem = 'Product name must be at least 3 characters';
    }

    // Quantity validation
    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || formData.quantity === '') {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    } else if (quantity > 10000) {
      newErrors.quantity = 'Quantity cannot exceed 10,000';
    }

    // Price validation
    const price = parseFloat(formData.pricePerUnit);
    if (!formData.pricePerUnit || formData.pricePerUnit === '') {
      newErrors.pricePerUnit = 'Price is required';
    } else if (isNaN(price) || price <= 0) {
      newErrors.pricePerUnit = 'Price must be a positive number';
    } else if (price > 100000) {
      newErrors.pricePerUnit = 'Price cannot exceed ₹1,00,000';
    }

    // Category validation
    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Please enter a category';
    } else if (formData.category.trim().length < 2) {
      newErrors.category = 'Category must be at least 2 characters long';
    } else if (formData.category.trim().length > 50) {
      newErrors.category = 'Category must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.category.trim())) {
      newErrors.category = 'Category should only contain letters and spaces';
    }

    // Image URL validation (optional but if provided, should be valid)
    if (formData.imagePath && formData.imagePath.trim() !== '') {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.imagePath)) {
        newErrors.imagePath = 'Please enter a valid image URL';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    console.log('Available categories:', categories);
    
    // Validate form
    const formErrors = validateForm();
    console.log('Validation errors:', formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      showSnackbar('Please fix the errors in the form', 'error');
      console.error('Form validation failed:', formErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      if (!user) {
        showSnackbar('Please login to add products.', 'error');
        return;
      }

      // Get farmerId from user object - must match exactly with SellerDashboard
      let farmerId = user?.farmerId;
      
      if (!farmerId) {
        console.warn('No farmerId found in user object:', user);
        console.warn('Available user properties:', Object.keys(user || {}));
        showSnackbar('Unable to identify farmer. Please login again.', 'error');
        return;
      }

      console.log('Using farmerId:', farmerId, 'for user:', user);

      // Ensure category is properly formatted
      const categoryName = formData.category.trim();
      if (!categoryName) {
        showSnackbar('Invalid category entry', 'error');
        return;
      }

      // Prepare product data for API
      const productData = {
        stockItem: formData.stockItem.trim(),
        quantity: parseInt(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        category: { 
          categoryName: categoryName
        },
        imagePath: formData.imagePath.trim() || null,
        description: formData.description.trim() || null
      };

      console.log('Sending product data to API:', productData);

      // Call API to add product
      const response = await sellerAPI.addProduct(farmerId, productData);
      
      console.log('API response:', response);
      
      showSnackbar('Product added successfully!', 'success');
      
      // Navigate back to seller dashboard after short delay
      setTimeout(() => {
        navigate('/seller');
      }, 1500);

    } catch (error) {
      console.error('Error adding product:', error);
      showSnackbar('Failed to add product. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToSellerDashboard = () => {
    navigate('/seller');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={handleBackToSellerDashboard}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Seller Dashboard
        </Link>
        <Typography color="text.primary">Add New Product</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="between" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToSellerDashboard}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            Add New Product
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            {/* Product Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <InventoryIcon sx={{ mr: 1 }} />
                Product Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Product Name */}
            <Grid item xs={12} md={8}>
              <TextField
                name="stockItem"
                label="Product Name"
                fullWidth
                required
                value={formData.stockItem}
                onChange={handleInputChange}
                error={!!errors.stockItem}
                helperText={errors.stockItem || 'Enter a descriptive name for your product'}
                placeholder="e.g., Organic Red Tomatoes, Fresh Mangoes"
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={4}>
              <TextField
                name="category"
                label="Category"
                fullWidth
                required
                value={formData.category}
                onChange={handleInputChange}
                error={!!errors.category}
                helperText={errors.category || 'Enter product category (e.g., Vegetables, Fruits, Grains)'}
                placeholder="e.g., Vegetables, Fruits, Dairy"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Pricing Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <MoneyIcon sx={{ mr: 1 }} />
                Pricing & Inventory
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12} md={6}>
              <TextField
                name="quantity"
                label="Quantity Available"
                type="number"
                fullWidth
                required
                value={formData.quantity}
                onChange={handleInputChange}
                error={!!errors.quantity}
                helperText={errors.quantity || 'Total quantity available for sale'}
                InputProps={{
                  inputProps: { min: 1, max: 10000 },
                  endAdornment: <InputAdornment position="end">units</InputAdornment>
                }}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} md={6}>
              <TextField
                name="pricePerUnit"
                label="Price per Unit"
                type="number"
                fullWidth
                required
                value={formData.pricePerUnit}
                onChange={handleInputChange}
                error={!!errors.pricePerUnit}
                helperText={errors.pricePerUnit || 'Price in Indian Rupees (₹)'}
                InputProps={{
                  inputProps: { min: 0.01, step: 0.01, max: 100000 },
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>

            {/* Additional Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <PhotoCameraIcon sx={{ mr: 1 }} />
                Additional Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Image URL */}
            <Grid item xs={12}>
              <TextField
                name="imagePath"
                label="Product Image URL (Optional)"
                fullWidth
                value={formData.imagePath}
                onChange={handleInputChange}
                error={!!errors.imagePath}
                helperText={errors.imagePath || 'Provide a direct link to product image'}
                placeholder="https://example.com/product-image.jpg"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Product Description (Optional)"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                helperText="Describe your product quality, origin, or special features"
                placeholder="Describe your product..."
              />
            </Grid>

            {/* Debug Panel - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: '#f5f5f5', p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Debug Information (Development Only)
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                    {JSON.stringify({
                      formData: formData,
                      errors: errors,
                      categoryLength: formData.category ? formData.category.length : 0,
                      categoryValid: formData.category && /^[a-zA-Z\s]+$/.test(formData.category.trim())
                    }, null, 2)}
                  </Typography>
                </Card>
              </Grid>
            )}

            {/* Preview Card */}
            {(formData.stockItem || formData.pricePerUnit) && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Product Preview
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Product:</strong> {formData.stockItem || 'Product Name'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Category:</strong> {formData.category || 'Enter Category'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Quantity:</strong> {formData.quantity || '0'} units
                        </Typography>
                        <Typography variant="body1">
                          <strong>Price:</strong> ₹{formData.pricePerUnit || '0.00'} per unit
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleBackToSellerDashboard}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={submitting}
                >
                  {submitting ? 'Adding Product...' : 'Add Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProduct;
