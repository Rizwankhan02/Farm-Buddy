import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import TestLogin from './components/TestLogin';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Admin from './components/Admin';
import SellerDashboard from './components/SellerDashboard';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import SellerProfile from './components/SellerProfile';
import UserProfile from './components/UserProfile';
import AdminProfile from './components/AdminProfile';
import ProfileErrorBoundary from './components/ProfileErrorBoundary';
import DebugProducts from './components/DebugProducts';
import SimpleProductTest from './components/SimpleProductTest';
import FarmerDashboard from './components/FarmerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff9800',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/test-login" element={<TestLogin />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller" 
                element={
                  <ProtectedRoute sellerOnly>
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/add-product" 
                element={
                  <ProtectedRoute sellerOnly>
                    <AddProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/edit-product/:productId" 
                element={
                  <ProtectedRoute sellerOnly>
                    <EditProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/profile" 
                element={
                  <ProtectedRoute sellerOnly>
                    <ProfileErrorBoundary>
                      <SellerProfile />
                    </ProfileErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileErrorBoundary>
                      <UserProfile />
                    </ProfileErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/profile" 
                element={
                  <ProtectedRoute adminOnly>
                    <ProfileErrorBoundary>
                      <AdminProfile />
                    </ProfileErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/debug" 
                element={<DebugProducts />} 
              />
              <Route 
                path="/farmer" 
                element={
                  <ProtectedRoute>
                    <FarmerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-product" 
                element={<SimpleProductTest />} 
              />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
