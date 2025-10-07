import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slide,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  TrendingUp as RevenueIcon,
  Assessment as ReportsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  PhotoCamera as PhotoCameraIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, userAPI } from '../services/api';

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    systemHealth: 98
  });

  useEffect(() => {
    fetchDynamicData();
  }, []);

  const fetchDynamicData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [farmersResponse, productsResponse, ordersResponse, usersResponse] = await Promise.all([
        adminAPI.getAllFarmers(),
        adminAPI.getAllProducts(),
        userAPI.getAllOrders(),
        userAPI.getAllUsers()
      ]);

      const farmersData = farmersResponse.data || [];
      const productsData = productsResponse.data || [];
      const ordersData = ordersResponse.data || [];
      const usersData = usersResponse.data || [];

      setFarmers(farmersData);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = ordersData.filter(order => order.status === 'Processing').length;

      setAdminStats({
        totalUsers: usersData.length,
        totalFarmers: farmersData.length,
        totalOrders: ordersData.length,
        totalRevenue: totalRevenue,
        totalProducts: productsData.length,
        pendingOrders: pendingOrders,
        systemHealth: 98
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Keep default values if API fails
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle = '' }) => (
    <Card
      className="profile-stat-card"
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea, #764ba2' : 
                                              color === 'success' ? '#56ab2f, #a8e6cf' :
                                              color === 'warning' ? '#f093fb, #f5576c' :
                                              color === 'info' ? '#4facfe, #00f2fe' :
                                              '#ff9a9e, #fecfef'})`,
        color: 'white',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent className="stats-card-content">
        <Box>
          <Typography variant="h3" component="div" className="stats-value">
            {typeof value === 'number' && value > 1000 ? 
              `${(value/1000).toFixed(1)}k` : value}
          </Typography>
          <Typography variant="body2" className="stats-title">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box className="stats-icon">
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <LinearProgress />
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            Loading Admin Dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={800}>
        <Box>
          {/* Admin Header */}
          <Paper 
            elevation={4} 
            className="profile-header"
            sx={{ 
              p: 4, 
              mb: 3, 
              background: 'linear-gradient(135deg, #e53e3e 0%, #fd5656 100%)',
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
                    <AdminIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Badge>
                
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Admin Dashboard
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      icon={<SecurityIcon />} 
                      label="Super Admin" 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip 
                      icon={<AdminIcon />} 
                      label="Full Access" 
                      size="small" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {user?.email || 'admin@farmersmarket.com'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {adminStats.systemHealth}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  System Health
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Admin Statistics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={adminStats.totalUsers}
                icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                color="primary"
                subtitle="Active users"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Farmers"
                value={adminStats.totalFarmers}
                icon={<StoreIcon sx={{ fontSize: 40 }} />}
                color="success"
                subtitle="Registered farmers"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Orders"
                value={adminStats.totalOrders}
                icon={<OrdersIcon sx={{ fontSize: 40 }} />}
                color="warning"
                subtitle={`${adminStats.pendingOrders} pending`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={`₹${adminStats.totalRevenue.toFixed(2)}`}
                icon={<RevenueIcon sx={{ fontSize: 40 }} />}
                color="info"
                subtitle="Total earnings"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Products"
                value={adminStats.totalProducts}
                icon={<AssessmentIcon sx={{ fontSize: 40 }} />}
                color="secondary"
                subtitle="Available products"
              />
            </Grid>
          </Grid>

          {/* Admin Overview Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent className="profile-card-content">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReportsIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" className="profile-section-title">
                      System Overview
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Platform Performance</Typography>
                      <Typography variant="body2">{adminStats.systemHealth}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={adminStats.systemHealth} 
                      className="profile-progress"
                      sx={{ height: 8, borderRadius: 4 }} 
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Active Products</Typography>
                      <Typography variant="body2">{adminStats.activeProducts}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      color="success" 
                      className="profile-progress"
                      sx={{ height: 8, borderRadius: 4 }} 
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">User Engagement</Typography>
                      <Typography variant="body2">92%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={92} 
                      color="info" 
                      className="profile-progress"
                      sx={{ height: 8, borderRadius: 4 }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent className="profile-card-content">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" className="profile-section-title">
                      Recent Activity
                    </Typography>
                  </Box>
                  
                  <List className="activity-timeline">
                    <ListItem className="profile-list-item activity-item">
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="New User Registration"
                        secondary="5 new users registered today"
                      />
                    </ListItem>
                    <Divider />
                    
                    <ListItem className="profile-list-item activity-item">
                      <ListItemIcon>
                        <StoreIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Seller Approval"
                        secondary="3 sellers approved for marketplace"
                      />
                    </ListItem>
                    <Divider />
                    
                    <ListItem className="profile-list-item activity-item">
                      <ListItemIcon>
                        <OrdersIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="High Order Volume"
                        secondary="150+ orders processed today"
                      />
                    </ListItem>
                    <Divider />
                    
                    <ListItem className="profile-list-item activity-item">
                      <ListItemIcon>
                        <SecurityIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Security Check"
                        secondary="System security scan completed"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pending Actions */}
          <Card elevation={3} sx={{ mt: 3, borderRadius: 3 }}>
            <CardContent className="profile-card-content">
              <Typography variant="h6" className="profile-section-title" sx={{ mb: 2 }}>
                Pending Actions ({adminStats.pendingApprovals})
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                      {adminStats.pendingApprovals}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                      Seller Approvals
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.dark' }}>
                      7
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.dark' }}>
                      Reported Issues
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.dark' }}>
                      23
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'info.dark' }}>
                      Product Reviews
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                      5
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                      Feature Requests
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Slide>
    </Container>
  );
};

export default AdminProfile;
