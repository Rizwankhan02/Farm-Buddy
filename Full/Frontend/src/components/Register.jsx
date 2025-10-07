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
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Fade,
  Zoom,
  Card,
  Avatar,
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  PersonAdd,
  Email,
  Lock,
  Phone,
  Home,
  Visibility,
  VisibilityOff,
  Agriculture,
  AdminPanelSettings,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneNo: '',
    address: '',
    userType: 'FARMER', // Default to FARMER
    isadmin: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    try {
      await userAPI.register(formData);
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container component="main" maxWidth="md">
        <Fade in={true} timeout={1000}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Welcome Section */}
            <Grid item xs={12} md={5}>
              <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
                <Zoom in={true} timeout={1200}>
                  <Avatar sx={{ 
                    width: 100, 
                    height: 100, 
                    mx: 'auto', 
                    mb: 3,
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <PersonAdd sx={{ fontSize: 50 }} />
                  </Avatar>
                </Zoom>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Join Our
                </Typography>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Marketplace! 🌱
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                  Connect with farmers and access premium agricultural products
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                  <Chip 
                    icon={<Agriculture />}
                    label="Premium Products" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    icon={<AccountCircle />}
                    label="Trusted Community" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={7}>
              <Zoom in={true} timeout={1400}>
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Fill in your details to get started
                    </Typography>
                  </Box>
                  
                  {error && (
                    <Fade in={true}>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: 2,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {success && (
                    <Fade in={true}>
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: 2,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        {success}
                      </Alert>
                    </Fade>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="firstname"
                          label="First Name"
                          name="firstname"
                          autoComplete="given-name"
                          value={formData.firstname}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountCircle sx={{ color: 'primary.main' }} />
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="lastname"
                          label="Last Name"
                          name="lastname"
                          autoComplete="family-name"
                          value={formData.lastname}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountCircle sx={{ color: 'primary.main' }} />
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
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
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
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          autoComplete="new-password"
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
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
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
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="phoneNo"
                          label="Phone Number"
                          name="phoneNo"
                          autoComplete="tel"
                          value={formData.phoneNo}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: 'primary.main' }} />
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
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="address"
                          label="Address"
                          name="address"
                          multiline
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                <Home sx={{ color: 'primary.main' }} />
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
                      <Grid item xs={12}>
                        <Card sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: 'rgba(102, 126, 234, 0.05)'
                        }}>
                          <FormControl component="fieldset">
                            <FormLabel 
                              component="legend" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 2
                              }}
                            >
                              I want to register as:
                            </FormLabel>
                            <RadioGroup
                              aria-label="userType"
                              name="userType"
                              value={formData.userType}
                              onChange={handleChange}
                            >
                              <FormControlLabel 
                                value="FARMER" 
                                control={<Radio />} 
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Agriculture sx={{ color: 'success.main' }} />
                                    <Box>
                                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Farmer
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        I want to buy farming products
                                      </Typography>
                                    </Box>
                                  </Box>
                                }
                                sx={{ 
                                  mb: 2,
                                  p: 2,
                                  border: '1px solid rgba(0,0,0,0.1)',
                                  borderRadius: 2,
                                  '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.05)'
                                  }
                                }}
                              />
                              <FormControlLabel 
                                value="ADMIN" 
                                control={<Radio />} 
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AdminPanelSettings sx={{ color: 'error.main' }} />
                                    <Box>
                                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Admin
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        I want to manage the marketplace
                                      </Typography>
                                    </Box>
                                  </Box>
                                }
                                sx={{ 
                                  p: 2,
                                  border: '1px solid rgba(0,0,0,0.1)',
                                  borderRadius: 2,
                                  '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.05)'
                                  }
                                }}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        mt: 4, 
                        mb: 3,
                        py: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={24} color="inherit" />
                          Creating Account...
                        </Box>
                      ) : (
                        '🎉 Create Account'
                      )}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Already have an account?
                      </Typography>
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button 
                          variant="text"
                          sx={{ 
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          Sign In Instead
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
