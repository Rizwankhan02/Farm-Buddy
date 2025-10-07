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
  Tab,
  Tabs,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  PhotoCamera as PhotoCameraIcon,
  Badge as BadgeIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNo: '',
    address: ''
  });

  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    favoriteProducts: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    memberSince: '2024'
  });

  useEffect(() => {
    loadUserProfile();
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    try {
      if (user?.id) {
        const response = await userAPI.getOrders(user.id);
        const userOrders = response.data || [];
        setOrders(userOrders);
        
        // Calculate user stats from orders
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const completedOrders = userOrders.filter(order => order.status === 'Delivered').length;
        const pendingOrders = userOrders.filter(order => order.status === 'Processing').length;
        
        setUserStats(prev => ({
          ...prev,
          totalOrders: userOrders.length,
          completedOrders,
          pendingOrders,
          totalSpent,
          favoriteProducts: 8, // Mock data
          memberSince: new Date().getFullYear().toString()
        }));
      }
    } catch (error) {
      console.error('Error loading user orders:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Use actual user data from auth context
      const profileData = {
        userId: user?.id || 1,
        firstname: user?.firstname || user?.name?.split(' ')[0] || 'Test',
        lastname: user?.lastname || user?.name?.split(' ')[1] || (user?.userType === 'ADMIN' ? 'Admin' : 'Farmer'),
        email: user?.email || 'user@farmersmarket.com',
        phoneNo: user?.phoneNo || '+91 9876543210',
        address: user?.address || '123 Farm Street, Agricultural City, State 400001',
        userType: user?.userType || 'FARMER'
      };
      
      setUserProfile(profileData);
      setFormData({
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        email: profileData.email,
        phoneNo: profileData.phoneNo,
        address: profileData.address
      });
    } catch (error) {
      setError('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully!');
      setEditing(false);
      loadUserProfile();
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setChangePasswordOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      firstname: userProfile.firstname || '',
      lastname: userProfile.lastname || '',
      email: userProfile.email || '',
      phoneNo: userProfile.phoneNo || '',
      address: userProfile.address || ''
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle = '' }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea, #764ba2' : 
                                              color === 'success' ? '#56ab2f, #a8e6cf' :
                                              color === 'warning' ? '#f093fb, #f5576c' :
                                              '#4facfe, #00f2fe'})`,
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
              {value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
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
                    {userProfile ? `${userProfile.firstname} ${userProfile.lastname}` : 'Loading...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      icon={<BadgeIcon />} 
                      label="Premium Member" 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip 
                      icon={<FavoriteIcon />} 
                      label="Loyal Customer" 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Member since {userStats.memberSince}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ₹{userStats.totalSpent.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Spent
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Orders"
                value={userStats.totalOrders}
                icon={<ShoppingCartIcon sx={{ fontSize: 40 }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Orders"
                value={userStats.completedOrders}
                icon={<LocalShippingIcon sx={{ fontSize: 40 }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Favorite Products"
                value={userStats.favoriteProducts}
                icon={<FavoriteIcon sx={{ fontSize: 40 }} />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Orders"
                value={userStats.pendingOrders}
                icon={<HistoryIcon sx={{ fontSize: 40 }} />}
                color="info"
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
                <Tab icon={<SecurityIcon />} label="Security" />
                <Tab icon={<SettingsIcon />} label="Preferences" />
              </Tabs>
            </Box>

            {/* Personal Information Tab */}
            <TabPanel value={currentTab} index={0}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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

            {/* Security Tab */}
            <TabPanel value={currentTab} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Security Settings
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Password</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Keep your account secure with a strong password
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<LockIcon />}
                          onClick={() => setChangePasswordOpen(true)}
                          sx={{ borderRadius: 2 }}
                        >
                          Change Password
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Two-Factor Authentication</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Add an extra layer of security to your account
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<SecurityIcon />}
                          disabled
                          sx={{ borderRadius: 2 }}
                        >
                          Enable 2FA (Coming Soon)
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel value={currentTab} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Preferences
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Notifications</Typography>
                        </Box>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <EmailIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Email Notifications"
                              secondary="Receive order updates via email"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Push Notifications"
                              secondary="Get real-time updates"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">Payment Methods</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Manage your saved payment methods
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<PaymentIcon />}
                          disabled
                          sx={{ borderRadius: 2 }}
                        >
                          Manage Payment Methods
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Slide>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
