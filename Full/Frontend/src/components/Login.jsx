import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Zoom,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalFlorist,
  Agriculture,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.login(formData);
      if (response.data) {
        login(response.data);
        
        // Redirect based on user type
        if (response.data.userType === 'ADMIN') {
          navigate('/admin');
        } else if (response.data.userType === 'FARMER') {
          navigate('/farmer');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container component="main" maxWidth="sm">
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={24}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Header Section */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              color: 'white',
              py: 4,
              textAlign: 'center'
            }}>
              <Zoom in={true} timeout={800}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <LocalFlorist sx={{ fontSize: 40 }} />
                </Avatar>
              </Zoom>
              
              <Typography component="h1" variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Sign in to FarmFresh Marketplace
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              {error && (
                <Fade in={true}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      border: '1px solid rgba(244, 67, 54, 0.2)'
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Password Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    mb: 3,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(46, 125, 50, 0.3)'
                    },
                    '&:disabled': {
                      background: 'rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                </Divider>

                {/* Quick Access Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AdminPanelSettings />}
                    onClick={() => setFormData({ email: 'admin@farmfresh.com', password: 'admin123' })}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        background: 'rgba(46, 125, 50, 0.04)',
                        borderColor: 'primary.dark'
                      }
                    }}
                  >
                    Demo Admin
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Agriculture />}
                    onClick={() => setFormData({ email: 'farmer@farmfresh.com', password: 'farmer123' })}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        background: 'rgba(46, 125, 50, 0.04)',
                        borderColor: 'primary.dark'
                      }
                    }}
                  >
                    Demo Farmer
                  </Button>
                </Box>

                {/* Register Link */}
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Don't have an account?
                  </Typography>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="text"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'rgba(46, 125, 50, 0.04)'
                        }
                      }}
                    >
                      Create Account
                    </Button>
                  </Link>
                </Box>

                {/* Test Login Link */}
                {process.env.NODE_ENV === 'development' && (
                  <Box textAlign="center" sx={{ mt: 2 }}>
                    <Link to="/test-login" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          borderColor: 'rgba(0,0,0,0.2)',
                          color: 'text.secondary',
                          '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main'
                          }
                        }}
                      >
                        Quick Test Login
                      </Button>
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
