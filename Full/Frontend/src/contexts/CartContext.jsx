import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const CartContext = createContext();

export { CartContext };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    updateCartTotal();
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
  };

  const updateCartTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
    setCartTotal(total);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const createOrder = async (user) => {
    if (!user || cartItems.length === 0) {
      throw new Error('Cannot create order: User not logged in or cart is empty');
    }

    const orderData = {
      userId: user.id,
      totalAmount: cartTotal,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.stockItem,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        category: item.category?.categoryName || 'General',
        farmerId: item.farmer?.farmerId || 1,
        farmerName: item.farmer ? `${item.farmer.firstname} ${item.farmer.lastname}` : 'Unknown Farmer'
      }))
    };

    try {
      const response = await userAPI.createOrder(orderData);
      clearCart(); // Clear cart after successful order
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
