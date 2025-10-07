import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Slide
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  PhotoCamera as PhotoCameraIcon,
  Badge as BadgeIcon,
  LocalShipping as ShippingIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { sellerAPI } from '../services/api';

const SellerProfile = () => {
  const { user } = useAuth();
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNo: '',
    address: ''
  });

  useEffect(() => {
    loadSellerProfile();
    loadSellerStats();
  }, []);

  const loadSellerProfile = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.getProfile(user.email);
      setSellerProfile(response.data);
      setFormData({
        firstname: response.data.firstname || '',
        lastname: response.data.lastname || '',
        email: response.data.email || '',
        phoneNo: response.data.phoneNo || '',
        address: response.data.address || ''
      });
    } catch (error) {
      setError('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerStats = async () => {
    try {
      setStatsLoading(true);
      // Mock statistics - replace with actual API calls
      const mockStats = {
        totalProducts: 15,
        totalSales: 243,
        totalRevenue: 12450.75,
        averageRating: 4.6,
        pendingOrders: 8,
        completedOrders: 235
      };
      setSellerStats(mockStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const response = await sellerAPI.updateProfile(sellerProfile.farmerId, formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      loadSellerProfile(); // Reload profile data
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      firstname: sellerProfile.firstname || '',
      lastname: sellerProfile.lastname || '',
      email: sellerProfile.email || '',
      phoneNo: sellerProfile.phoneNo || '',
      address: sellerProfile.address || ''
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const StatCard = ({ title, value, icon, color = 'primary', loading = false }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}.light, ${color}.main)`,
        color: 'white',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={500}>
          <Box sx={{ py: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={800}>
        <Box>
          {/* Header Section */}
          <Paper 
            elevation={4} 
            className="profile-header"
            sx={{ 
              p: 4, 
              mb: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton size="small" sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar 
                    className="profile-avatar"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: 80, 
                      height: 80,
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Badge>
                
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {sellerProfile ? `${sellerProfile.firstname} ${sellerProfile.lastname}` : 'Loading...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      icon={<BadgeIcon />} 
                      label="Verified Seller" 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ color: '#FFD700', mr: 0.5 }} />
                      <Typography variant="body1">
                        {sellerStats.averageRating} Rating
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Seller ID: #{sellerProfile?.farmerId}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ₹{sellerStats.totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Revenue
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Products"
                value={sellerStats.totalProducts}
                icon={<InventoryIcon sx={{ fontSize: 40 }} />}
                color="primary"
                loading={statsLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Sales"
                value={sellerStats.totalSales}
                icon={<ShoppingCartIcon sx={{ fontSize: 40 }} />}
                color="success"
                loading={statsLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Orders"
                value={sellerStats.pendingOrders}
                icon={<ShippingIcon sx={{ fontSize: 40 }} />}
                color="warning"
                loading={statsLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Orders"
                value={sellerStats.completedOrders}
                icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
                color="info"
                loading={statsLoading}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Main Content with Tabs */}
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }
                }}
              >
                <Tab icon={<PersonIcon />} label="Personal Info" />
                <Tab icon={<AssessmentIcon />} label="Analytics" />
                <Tab icon={<TimelineIcon />} label="Activity" />
              </Tabs>
            </Box>

            {/* Personal Information Tab */}
            <TabPanel value={currentTab} index={0}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Personal Information
                  </Typography>
                  {!editing && (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Basic Details</Typography>
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="firstname"
                              value={formData.firstname}
                              onChange={handleChange}
                              disabled={!editing}
                              variant={editing ? "outlined" : "filled"}
                              sx={{ mb: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="lastname"
                              value={formData.lastname}
                              onChange={handleChange}
                              disabled={!editing}
                              variant={editing ? "outlined" : "filled"}
                              sx={{ mb: 2 }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Contact Information</Typography>
                        </Box>
                        
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!editing}
                          variant={editing ? "outlined" : "filled"}
                          sx={{ mb: 2 }}
                          InputProps={{
                            startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleChange}
                          disabled={!editing}
                          variant={editing ? "outlined" : "filled"}
                          InputProps={{
                            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Address Information</Typography>
                        </Box>
                        
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!editing}
                          multiline
                          rows={3}
                          variant={editing ? "outlined" : "filled"}
                          InputProps={{
                            startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {editing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Analytics Tab */}
            <TabPanel value={currentTab} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Performance Analytics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Sales Performance
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Monthly Target</Typography>
                            <Typography variant="body2">78%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Customer Satisfaction</Typography>
                            <Typography variant="body2">92%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={92} color="success" sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Quick Stats
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <TrendingUpIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Revenue Growth"
                              secondary="+15% from last month"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <StarIcon sx={{ color: '#FFD700' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Average Rating"
                              secondary={`${sellerStats.averageRating}/5.0 stars`}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Activity Tab */}
            <TabPanel value={currentTab} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Recent Activity
                </Typography>
                
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <StoreIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Product Added"
                          secondary="Added 'Fresh Organic Tomatoes' to inventory - 2 hours ago"
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <ShoppingCartIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Order Completed"
                          secondary="Order #12345 delivered successfully - 5 hours ago"
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Profile Updated"
                          secondary="Contact information updated - 1 day ago"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Slide>
    </Container>
  );
};

export default SellerProfile;
