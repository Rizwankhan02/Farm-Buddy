import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Add,
  Delete,
  Edit
} from '@mui/icons-material';
import { adminAPI, farmerAPI } from '../services/api';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (tabValue === 0) {
      fetchFarmers();
    } else if (tabValue === 1) {
      fetchProducts();
    }
  }, [tabValue]);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllFarmers();
      setFarmers(response.data);
    } catch (error) {
      setError('Failed to fetch farmers');
      console.error('Error fetching farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type, data = {}) => {
    setDialogType(type);
    setFormData(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (dialogType === 'addFarmer') {
        await adminAPI.addFarmer(formData);
        fetchFarmers();
      } else if (dialogType === 'addProduct') {
        // You'll need to select a farmer ID for this
        await adminAPI.addProduct(formData.farmerId, formData);
        fetchProducts();
      }
      
      handleCloseDialog();
      alert('Operation completed successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarmer = async (farmerId) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        await adminAPI.removeFarmer(farmerId);
        fetchFarmers();
        alert('Farmer deleted successfully');
      } catch (error) {
        console.error('Error deleting farmer:', error);
        alert('Failed to delete farmer');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.removeProduct(productId);
        fetchProducts();
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Farmers" />
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Manage Farmers</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('addFarmer')}
          >
            Add Farmer
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {farmers.map((farmer) => (
                  <TableRow key={farmer.farmerId}>
                    <TableCell>{farmer.farmerId}</TableCell>
                    <TableCell>{farmer.firstname} {farmer.lastname}</TableCell>
                    <TableCell>{farmer.email}</TableCell>
                    <TableCell>{farmer.phoneNo}</TableCell>
                    <TableCell>{farmer.address}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteFarmer(farmer.farmerId)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Manage Products</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('addProduct')}
          >
            Add Product
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Farmer</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.stockItem}</TableCell>
                    <TableCell>₹{product.pricePerUnit}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {product.farmer1?.firstname} {product.farmer1?.lastname}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6">Orders Management</Typography>
        <Typography color="text.secondary">
          Orders management functionality to be implemented
        </Typography>
      </TabPanel>

      {/* Add Farmer/Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'addFarmer' ? 'Add New Farmer' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'addFarmer' ? (
            <>
              <TextField
                margin="dense"
                name="firstname"
                label="First Name"
                fullWidth
                variant="outlined"
                value={formData.firstname || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="lastname"
                label="Last Name"
                fullWidth
                variant="outlined"
                value={formData.lastname || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={formData.email || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="phoneNo"
                label="Phone Number"
                fullWidth
                variant="outlined"
                value={formData.phoneNo || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.address || ''}
                onChange={handleFormChange}
              />
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                name="farmerId"
                label="Farmer ID"
                fullWidth
                variant="outlined"
                value={formData.farmerId || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="stockItem"
                label="Product Name"
                fullWidth
                variant="outlined"
                value={formData.stockItem || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="pricePerUnit"
                label="Price per Unit"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.pricePerUnit || ''}
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.quantity || ''}
                onChange={handleFormChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
