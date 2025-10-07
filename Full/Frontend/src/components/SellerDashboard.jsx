import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Badge,
  CardActions,
  CardMedia,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { sellerAPI } from '../services/api';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`seller-tabpanel-${index}`}
      aria-labelledby={`seller-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockItems: 0
  });

  // Fetch seller data on component mount
  useEffect(() => {
    if (user) {
      loadSellerData();
    }
  }, [user]);

  // Reload data when navigating back to dashboard
  useEffect(() => {
    if (user && location.pathname === '/seller') {
      console.log('Refreshing seller dashboard data...');
      loadSellerData();
    }
  }, [location.pathname, user]);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const categoriesResponse = await sellerAPI.getCategories();
      console.log('Categories loaded:', categoriesResponse.data);
      setCategories(categoriesResponse.data);

      // Load products if we have farmer ID
      if (user.farmerId) {
        const productsResponse = await sellerAPI.getProducts(user.farmerId);
        setProducts(productsResponse.data);

        // Load stats
        try {
          const statsResponse = await sellerAPI.getStats(user.farmerId);
          setStats(statsResponse.data);
        } catch (error) {
          console.log('Stats not available');
        }
      }
    } catch (error) {
      console.error('Error loading seller data:', error);
      showSnackbar('Error loading data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

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

  const handleDeleteProduct = async (productId, productName) => {
    setDeleteDialog({
      open: true,
      productId,
      productName
    });
  };

  const confirmDelete = async () => {
    try {
      await sellerAPI.deleteProduct(deleteDialog.productId);
      showSnackbar('Product deleted successfully!');
      loadSellerData(); // Reload data
      setDeleteDialog({ open: false, productId: null, productName: '' });
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar('Error deleting product. Please try again.', 'error');
      setDeleteDialog({ open: false, productId: null, productName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, productId: null, productName: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Welcome back, {user?.name || 'Seller'}! Manage your products and track your sales.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5">
                    {products.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(stats.totalRevenue || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalSales || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h5">
                    {products.filter(p => p.quantity < 10).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* My Products Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              My Products
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your product inventory, update prices, and track stock levels
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewMode === 'cards'}
                  onChange={(e) => setViewMode(e.target.checked ? 'cards' : 'table')}
                  size="small"
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  {viewMode === 'cards' ? <ViewModuleIcon fontSize="small" /> : <ViewListIcon fontSize="small" />}
                  {viewMode === 'cards' ? 'Cards' : 'Table'}
                </Box>
              }
            />
            <Tooltip title="Refresh Products">
              <IconButton onClick={loadSellerData} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/seller/add-product')}
              size="large"
            >
              Add New Product
            </Button>
          </Box>
        </Box>

        {products.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              <InventoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Start building your inventory by adding your first product
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/seller/add-product')}
              >
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <Box sx={{ p: 1, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
                  <Typography variant="caption" color="primary.main">Total Products</Typography>
                  <Typography variant="h6" color="primary.main">{products.length}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ p: 1, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="caption" color="success.main">In Stock</Typography>
                  <Typography variant="h6" color="success.main">{products.filter(p => p.quantity > 10).length}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ p: 1, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.200' }}>
                  <Typography variant="caption" color="warning.main">Low Stock</Typography>
                  <Typography variant="h6" color="warning.main">{products.filter(p => p.quantity <= 10 && p.quantity > 0).length}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ p: 1, bgcolor: 'error.50', borderRadius: 1, border: '1px solid', borderColor: 'error.200' }}>
                  <Typography variant="caption" color="error.main">Out of Stock</Typography>
                  <Typography variant="h6" color="error.main">{products.filter(p => p.quantity === 0).length}</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Product Display */}
            {viewMode === 'cards' ? (
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        sx={{ 
                          height: 140, 
                          bgcolor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {product.imagePath ? (
                          <img 
                            src={product.imagePath} 
                            alt={product.stockItem}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <InventoryIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                        )}
                      </CardMedia>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom noWrap>
                          {product.stockItem}
                        </Typography>
                        <Chip 
                          label={product.category?.categoryName || 'N/A'} 
                          size="small" 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {product.description ? 
                            (product.description.length > 60 ? 
                              product.description.substring(0, 60) + '...' : 
                              product.description
                            ) : 
                            'No description available'
                          }
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="h6" color="primary">
                            {formatCurrency(product.pricePerUnit)}
                          </Typography>
                          <Typography variant="body2">
                            Stock: {product.quantity}
                          </Typography>
                        </Box>
                        <Chip
                          label={product.quantity < 10 ? (product.quantity === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'}
                          color={product.quantity === 0 ? 'error' : product.quantity < 10 ? 'warning' : 'success'}
                          size="small"
                          fullWidth
                        />
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/seller/edit-product/${product.id}`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteProduct(product.id, product.stockItem)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {product.imagePath ? (
                              <Avatar
                                src={product.imagePath}
                                sx={{ mr: 2, width: 40, height: 40 }}
                              />
                            ) : (
                              <Avatar sx={{ mr: 2, width: 40, height: 40, bgcolor: 'grey.300' }}>
                                <InventoryIcon />
                              </Avatar>
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {product.stockItem}
                              </Typography>
                              {product.description && (
                                <Typography variant="caption" color="textSecondary">
                                  {product.description.substring(0, 50)}
                                  {product.description.length > 50 ? '...' : ''}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.category?.categoryName || 'N/A'} 
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Badge 
                            badgeContent={product.quantity < 10 ? '!' : 0} 
                            color="warning"
                          >
                            <Typography variant="body2">
                              {product.quantity}
                            </Typography>
                          </Badge>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(product.pricePerUnit)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={product.quantity === 0 ? 'Out of Stock' : product.quantity < 10 ? 'Low Stock' : product.quantity < 20 ? 'Medium' : 'In Stock'}
                            color={product.quantity === 0 ? 'error' : product.quantity < 10 ? 'warning' : product.quantity < 20 ? 'info' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit Product">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/seller/edit-product/${product.id}`)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(product.id, product.stockItem)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="seller dashboard tabs">
          <Tab label="Sales & Analytics" />
          <Tab label="Product Details" />
        </Tabs>

        {/* Sales & Analytics Tab */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Sales & Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Total Products:</Typography>
                    <Typography fontWeight="bold">{products.length}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Active Products:</Typography>
                    <Typography fontWeight="bold">
                      {products.filter(p => p.quantity > 0).length}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Out of Stock:</Typography>
                    <Typography fontWeight="bold" color="error.main">
                      {products.filter(p => p.quantity === 0).length}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Low Stock Alert:</Typography>
                    <Typography fontWeight="bold" color="warning.main">
                      {products.filter(p => p.quantity < 10 && p.quantity > 0).length}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Overview
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {formatCurrency(stats.totalRevenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total revenue from all sales
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Product Details Tab */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Detailed Product Information
          </Typography>
          
          {products.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No products to display. Add your first product to see detailed information here.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} md={6} key={product.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        {product.imagePath ? (
                          <Avatar
                            src={product.imagePath}
                            sx={{ mr: 2, width: 56, height: 56 }}
                          />
                        ) : (
                          <Avatar sx={{ mr: 2, width: 56, height: 56, bgcolor: 'grey.300' }}>
                            <InventoryIcon />
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="h6">{product.stockItem}</Typography>
                          <Chip 
                            label={product.category?.categoryName || 'N/A'} 
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Price</Typography>
                          <Typography variant="h6" color="primary">
                            {formatCurrency(product.pricePerUnit)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Stock</Typography>
                          <Typography variant="h6">
                            {product.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Description</Typography>
                          <Typography variant="body2">
                            {product.description || 'No description available'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Chip
                              label={product.quantity === 0 ? 'Out of Stock' : product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                              color={product.quantity === 0 ? 'error' : product.quantity < 10 ? 'warning' : 'success'}
                            />
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/seller/edit-product/${product.id}`)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteProduct(product.id, product.stockItem)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{deleteDialog.productName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default SellerDashboard;
