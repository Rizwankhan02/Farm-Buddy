import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Agriculture,
  Logout,
  Person,
  Dashboard,
  LocalFlorist,
  ShoppingBag,
  AdminPanelSettings,
  Store,
  Home,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          onClick={handleHome}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ 
              mr: 1,
              background: 'rgba(255,255,255,0.1)',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)',
                transform: 'rotate(10deg)'
              }
            }}
          >
            <LocalFlorist sx={{ fontSize: 32 }} />
          </IconButton>
          
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff, #E8F5E8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FarmFresh
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
                letterSpacing: 1
              }}
            >
              Marketplace
            </Typography>
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Tooltip title="Home" arrow>
            <Button 
              color="inherit" 
              onClick={handleHome}
              startIcon={<Home />}
              sx={{
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Home
            </Button>
          </Tooltip>
          
          {isAuthenticated && user?.userType === 'FARMER' && (
            <Tooltip title="Browse Marketplace" arrow>
              <Button 
                color="inherit" 
                onClick={() => navigate('/farmer')}
                startIcon={<Store />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Shop
              </Button>
            </Tooltip>
          )}
          
          {isAuthenticated && user?.userType === 'ADMIN' && (
            <Tooltip title="Admin Dashboard" arrow>
              <Button 
                color="inherit" 
                onClick={() => navigate('/admin')}
                startIcon={<Dashboard />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Dashboard
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Cart Icon for Farmers */}
          {isAuthenticated && user?.userType === 'FARMER' && (
            <Tooltip title="Shopping Cart" arrow>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleCart}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Badge 
                  badgeContent={getCartItemCount()} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#FF4444',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* User Role Chip */}
              <Chip
                icon={user?.userType === 'ADMIN' ? <AdminPanelSettings /> : <Agriculture />}
                label={user?.userType === 'ADMIN' ? 'Admin' : 'Farmer'}
                size="small"
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
              
              {/* User Avatar */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {user?.firstname?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>

              {/* Enhanced User Menu */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 250,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }
                }}
                TransitionComponent={Fade}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user?.firstname || user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Chip
                    size="small"
                    label={user?.userType}
                    sx={{ mt: 1 }}
                    color={user?.userType === 'ADMIN' ? 'error' : 'success'}
                  />
                </Box>

                {/* Profile Menu Item */}
                <MenuItem 
                  onClick={() => { handleClose(); navigate('/profile'); }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>

                {/* Farmer-specific menu items */}
                {user?.userType === 'FARMER' && [
                  <MenuItem 
                    key="farmer-marketplace" 
                    onClick={() => { handleClose(); navigate('/farmer'); }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <Store />
                    </ListItemIcon>
                    <ListItemText>Marketplace</ListItemText>
                  </MenuItem>,
                  <MenuItem 
                    key="farmer-orders" 
                    onClick={() => { handleClose(); navigate('/orders'); }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText>My Orders</ListItemText>
                  </MenuItem>
                ]}

                {/* Admin-specific menu items */}
                {user?.userType === 'ADMIN' && [
                  <MenuItem 
                    key="admin-panel" 
                    onClick={() => { handleClose(); navigate('/admin'); }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <Dashboard />
                    </ListItemIcon>
                    <ListItemText>Admin Panel</ListItemText>
                  </MenuItem>,
                  <MenuItem 
                    key="admin-profile" 
                    onClick={() => { handleClose(); navigate('/admin/profile'); }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText>Admin Profile</ListItemText>
                  </MenuItem>
                ]}

                <Divider />
                
                {/* Logout */}
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5,
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Logout sx={{ color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/test-login')}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Test Login
                </Button>
              )}
              
              <Button 
                color="inherit" 
                onClick={handleLogin}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Login
              </Button>
              
              <Button 
                color="inherit" 
                onClick={handleRegister}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
