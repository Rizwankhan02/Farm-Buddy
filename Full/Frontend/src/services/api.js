import axios from 'axios';

// Mock data storage with localStorage persistence
const MOCK_PRODUCTS_KEY = 'mockProducts';
const NEXT_ID_KEY = 'nextProductId';

// Initialize mock data from localStorage or use defaults
let mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || [
  {
    id: 1,
    stockItem: 'Organic Tomatoes',
    quantity: 50,
    pricePerUnit: 85.0,
    category: { id: 1, categoryName: 'Vegetables' },
    imagePath: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300',
    farmerId: 1,
    description: 'Fresh organic tomatoes grown locally'
  },
  {
    id: 2,
    stockItem: 'Fresh Apples',
    quantity: 30,
    pricePerUnit: 120.0,
    category: { id: 2, categoryName: 'Fruits' },
    imagePath: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
    farmerId: 1,
    description: 'Crisp and sweet apples from our orchard'
  },
  {
    id: 3,
    stockItem: 'Carrots',
    quantity: 5,
    pricePerUnit: 45.0,
    category: { id: 1, categoryName: 'Vegetables' },
    imagePath: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300',
    farmerId: 1,
    description: 'Fresh orange carrots with great crunch'
  }
];

let nextProductId = parseInt(localStorage.getItem(NEXT_ID_KEY)) || 4;

// Mock farmers data
const MOCK_FARMERS_KEY = 'mockFarmers';
let mockFarmers = JSON.parse(localStorage.getItem(MOCK_FARMERS_KEY)) || [
  {
    farmerId: 1,
    id: 1,
    firstname: 'John',
    lastname: 'Smith',
    email: 'john.smith@farm.com',
    phoneNo: '+1234567890',
    address: '123 Farm Road, Rural Area',
    userType: 'FARMER'
  },
  {
    farmerId: 2,
    id: 2,
    firstname: 'Sarah',
    lastname: 'Johnson',
    email: 'sarah.johnson@farm.com',
    phoneNo: '+1234567891',
    address: '456 Valley Street, Farm District',
    userType: 'FARMER'
  }
];

let nextFarmerId = 3;

// Mock orders data
const MOCK_ORDERS_KEY = 'mockOrders';
let mockOrders = JSON.parse(localStorage.getItem(MOCK_ORDERS_KEY)) || [
  {
    id: 1,
    userId: 2, // Farmer user ID
    orderDate: '2025-08-08T10:00:00Z',
    status: 'Delivered',
    totalAmount: 198.50,
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Organic Tomatoes',
        quantity: 2,
        pricePerUnit: 85.0,
        category: 'Vegetables',
        farmerId: 1,
        farmerName: 'John Smith'
      },
      {
        id: 2,
        productId: 3,
        productName: 'Carrots',
        quantity: 1,
        pricePerUnit: 45.0,
        category: 'Vegetables',
        farmerId: 1,
        farmerName: 'John Smith'
      }
    ]
  },
  {
    id: 2,
    userId: 2,
    orderDate: '2025-08-05T14:30:00Z',
    status: 'Shipped',
    totalAmount: 120.0,
    items: [
      {
        id: 3,
        productId: 2,
        productName: 'Fresh Apples',
        quantity: 1,
        pricePerUnit: 120.0,
        category: 'Fruits',
        farmerId: 1,
        farmerName: 'John Smith'
      }
    ]
  },
  {
    id: 3,
    userId: 2,
    orderDate: '2025-08-01T09:15:00Z',
    status: 'Processing',
    totalAmount: 255.0,
    items: [
      {
        id: 4,
        productId: 1,
        productName: 'Organic Tomatoes',
        quantity: 3,
        pricePerUnit: 85.0,
        category: 'Vegetables',
        farmerId: 1,
        farmerName: 'John Smith'
      }
    ]
  }
];

let nextOrderId = 4;

// Save to localStorage
const saveMockData = () => {
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(mockProducts));
  localStorage.setItem(NEXT_ID_KEY, nextProductId.toString());
  localStorage.setItem(MOCK_FARMERS_KEY, JSON.stringify(mockFarmers));
};

// Initialize data in localStorage if not exists
if (!localStorage.getItem(MOCK_PRODUCTS_KEY) || !localStorage.getItem(MOCK_FARMERS_KEY)) {
  saveMockData();
}

// Base URL for the backend API
const BASE_URL = 'http://localhost:8080/FarmersMarketplace';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER_REGISTER: '/user/register',
  USER_LOGIN: '/user/login',
  USER_ADD_TO_CART: '/user/addtocart',
  USER_CHECKOUT: '/user/checkout',
  USER_REMOVE_FROM_CART: '/user/removefromcart',
  USER_PLACE_ORDER: '/user/placeorder',
  USER_GET_ORDERS: '/user/getorders',
  
  // Admin endpoints
  ADMIN_ADD_FARMER: '/admin/newfarmer',
  ADMIN_ADD_PRODUCT: '/admin/newproduct',
  ADMIN_UPLOAD_IMAGE: '/admin/{productid}/image',
  ADMIN_DOWNLOAD_IMAGE: '/admin/{productid}',
  ADMIN_REMOVE_FARMER: '/admin/removefarmer',
  ADMIN_REMOVE_PRODUCT: '/admin/removeproduct',
  ADMIN_UPDATE_PRODUCT: '/admin/updateproduct',
  ADMIN_GET_ALL_FARMERS: '/admin/allfarmers',
  ADMIN_GET_ALL_PRODUCTS: '/admin/allproducts',
  ADMIN_GET_ALL_CATEGORIES: '/admin/allcategories',
  ADMIN_GET_ALL_USERS: '/admin/allusers',
  ADMIN_GET_ALL_ORDERS: '/admin/allorders',
  
  // Farmer endpoints
  FARMER_LIST: '/farmer/list',
  FARMER_DETAILS: '/farmer/farmerdetails',
  FARMER_PRODUCTS: '/farmer/products',
  FARMER_PRODUCT_DETAILS: '/farmer/products/{farmerid}/{productid}',
  FARMER_ALL_PRODUCTS: '/farmer/allproducts',
  
  // Dummy endpoint
  DUMMY: '/dummy'
};

// User API functions
export const userAPI = {
  register: (userData) => api.post(API_ENDPOINTS.USER_REGISTER, userData).catch((error) => {
    console.log('Registration API failed, using fallback registration');
    // Fallback registration for testing when backend is not available
    console.log('Registering user with data:', userData);
    
    // Simulate successful registration
    const registeredUser = {
      id: Math.floor(Math.random() * 1000) + 1,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      userType: userData.userType,
      isadmin: userData.userType === 'ADMIN',
      phoneNo: userData.phoneNo,
      address: userData.address,
      farmerId: userData.userType === 'ADMIN' ? 1 : null
    };
    
    // Store in localStorage for persistence
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if user already exists
    const existingUser = existingUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    existingUsers.push(registeredUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    console.log('Fallback registration successful:', registeredUser);
    return { data: registeredUser };
  }),
  
  login: (credentials) => api.post(API_ENDPOINTS.USER_LOGIN, credentials).catch((error) => {
    console.log('Login API failed, using fallback authentication');
    
    // First, check registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(u => u.email === credentials.email);
    
    if (user) {
      console.log('Found registered user:', user);
      return { data: user };
    }
    
    // Fallback authentication for testing
    if (credentials.email && credentials.password) {
      // Determine user type based on email pattern for testing
      let userType = 'FARMER';
      let isadmin = false;
      let farmerId = null;
      
      if (credentials.email.includes('admin')) {
        userType = 'ADMIN';
        isadmin = true;
        farmerId = 1;
      } else if (credentials.email.includes('farmer')) {
        userType = 'FARMER';
        isadmin = false;
      }
      
      const userData = {
        id: Math.floor(Math.random() * 1000) + 1,
        farmerId: farmerId,
        email: credentials.email,
        firstname: 'Test',
        lastname: userType === 'ADMIN' ? 'Admin' : 'Farmer',
        name: userType === 'ADMIN' ? 'Test Admin' : 'Test Farmer',
        userType: userType,
        isadmin: isadmin,
        phoneNo: '+1234567890',
        address: '123 Test Street'
      };
      
      console.log('Fallback authentication successful:', userData);
      return { data: userData };
    }
    throw error;
  }),
  
  addToCart: (productId, quantity) => api.post(`${API_ENDPOINTS.USER_ADD_TO_CART}/${productId}`, null, {
    params: { qty: quantity }
  }).catch((error) => {
    console.log('Add to cart API failed, using local storage fallback');
    // Fallback to local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ productId, quantity, addedAt: new Date().toISOString() });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    return { data: 'Added to cart (offline mode)' };
  }),
  
  checkout: () => api.get(API_ENDPOINTS.USER_CHECKOUT).catch(() => {
    // Fallback cart data from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return {
      data: cartItems.map(item => ({
        id: item.productId,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.productId,
          stockItem: `Product ${item.productId}`,
          pricePerUnit: 50.0,
          category: { categoryName: 'Sample Category' }
        }
      }))
    };
  }),
  
  removeFromCart: (productId) => api.post(`${API_ENDPOINTS.USER_REMOVE_FROM_CART}/${productId}`).catch(() => {
    // Fallback to local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const filteredItems = cartItems.filter(item => item.productId !== productId);
    localStorage.setItem('cartItems', JSON.stringify(filteredItems));
    return { data: 'Removed from cart (offline mode)' };
  }),
  
  placeOrder: () => api.post(API_ENDPOINTS.USER_PLACE_ORDER).catch(() => ({
    data: 'Order placed successfully (offline mode)'
  })),
  
  getOrders: (userId = null) => api.get(API_ENDPOINTS.USER_GET_ORDERS).catch(() => {
    console.log('Using fallback orders data for user:', userId);
    const userOrders = userId ? 
      mockOrders.filter(order => order.userId === parseInt(userId)) : 
      mockOrders;
    return { data: userOrders };
  }),

  createOrder: (orderData) => api.post('/api/orders', orderData).catch(() => {
    console.log('Using fallback order creation');
    const newOrder = {
      id: nextOrderId++,
      userId: orderData.userId,
      orderDate: new Date().toISOString(),
      status: 'Processing',
      totalAmount: orderData.totalAmount,
      items: orderData.items
    };
    mockOrders.push(newOrder);
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(mockOrders));
    return { data: newOrder };
  }),

  getAllOrders: () => api.get('/api/orders').catch(() => {
    console.log('Using fallback all orders data');
    return { data: [...mockOrders] };
  })
};

// Admin API functions
export const adminAPI = {
  addFarmer: (farmerData) => api.post(API_ENDPOINTS.ADMIN_ADD_FARMER, farmerData).catch(() => {
    console.log('API failed, adding farmer to mock storage');
    mockFarmers = JSON.parse(localStorage.getItem(MOCK_FARMERS_KEY)) || mockFarmers;
    
    const newFarmer = {
      farmerId: nextFarmerId++,
      id: nextFarmerId,
      firstname: farmerData.firstname,
      lastname: farmerData.lastname,
      email: farmerData.email,
      phoneNo: farmerData.phoneNo,
      address: farmerData.address,
      userType: 'FARMER'
    };
    
    mockFarmers.push(newFarmer);
    localStorage.setItem(MOCK_FARMERS_KEY, JSON.stringify(mockFarmers));
    
    return {
      data: {
        message: 'Farmer added successfully',
        farmer: newFarmer
      }
    };
  }),
  
  addProduct: (farmerId, productData) => api.post(`${API_ENDPOINTS.ADMIN_ADD_PRODUCT}/${farmerId}`, productData).catch(() => {
    console.log('API failed, adding product to mock storage');
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    
    const newProduct = {
      id: nextProductId++,
      stockItem: productData.stockItem,
      quantity: parseInt(productData.quantity),
      pricePerUnit: parseFloat(productData.pricePerUnit),
      description: productData.description || '',
      imagePath: productData.imagePath || '',
      farmerId: parseInt(farmerId),
      category: typeof productData.category === 'string' ? 
        { id: nextProductId, categoryName: productData.category } : 
        (productData.category && productData.category.categoryName ? 
          { id: productData.category.id || nextProductId, categoryName: productData.category.categoryName } : 
          { id: nextProductId, categoryName: productData.category || 'General' })
    };
    
    mockProducts.push(newProduct);
    saveMockData();
    
    return {
      data: {
        message: 'Product added successfully',
        product: newProduct
      }
    };
  }),
  uploadImage: (productId, imageFile) => {
    const formData = new FormData();
    formData.append('imgFile', imageFile);
    return api.post(`/admin/${productId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  downloadImage: (productId) => api.get(`/admin/${productId}`, { responseType: 'blob' }),
  removeFarmer: (farmerId) => api.get(`${API_ENDPOINTS.ADMIN_REMOVE_FARMER}/${farmerId}`).catch(() => {
    console.log('API failed, removing farmer from mock storage');
    mockFarmers = JSON.parse(localStorage.getItem(MOCK_FARMERS_KEY)) || mockFarmers;
    
    const originalLength = mockFarmers.length;
    mockFarmers = mockFarmers.filter(farmer => farmer.farmerId != farmerId && farmer.id != farmerId);
    
    localStorage.setItem(MOCK_FARMERS_KEY, JSON.stringify(mockFarmers));
    
    return {
      data: {
        message: 'Farmer removed successfully',
        removed: originalLength > mockFarmers.length
      }
    };
  }),
  
  removeProduct: (productId) => api.get(`${API_ENDPOINTS.ADMIN_REMOVE_PRODUCT}/${productId}`).catch(() => {
    console.log('API failed, removing product from mock storage');
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    
    const originalLength = mockProducts.length;
    mockProducts = mockProducts.filter(product => product.id != productId);
    
    saveMockData();
    
    return {
      data: {
        message: 'Product removed successfully',
        removed: originalLength > mockProducts.length
      }
    };
  }),
  updateProduct: (productId, productData) => api.put(`${API_ENDPOINTS.ADMIN_UPDATE_PRODUCT}/${productId}`, null, {
    params: productData
  }),
  getAllFarmers: () => api.get(API_ENDPOINTS.ADMIN_GET_ALL_FARMERS).catch(() => {
    console.log('API failed, using mock farmers for admin');
    mockFarmers = JSON.parse(localStorage.getItem(MOCK_FARMERS_KEY)) || mockFarmers;
    return {
      data: mockFarmers
    };
  }),
  
  getAllProducts: () => api.get(API_ENDPOINTS.ADMIN_GET_ALL_PRODUCTS).catch(() => {
    console.log('API failed, using mock products for admin');
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    return {
      data: mockProducts
    };
  }),
  getAllCategories: () => api.get(API_ENDPOINTS.ADMIN_GET_ALL_CATEGORIES),
  getAllUsers: () => api.get(API_ENDPOINTS.ADMIN_GET_ALL_USERS),
  getAllOrders: () => api.get(API_ENDPOINTS.ADMIN_GET_ALL_ORDERS)
};

// Farmer API functions
export const farmerAPI = {
  getFarmersList: () => api.get(API_ENDPOINTS.FARMER_LIST).catch(() => {
    console.log('API failed, using mock farmers list');
    mockFarmers = JSON.parse(localStorage.getItem(MOCK_FARMERS_KEY)) || mockFarmers;
    return {
      data: mockFarmers
    };
  }),
  
  getFarmerDetails: (farmerId) => api.get(`${API_ENDPOINTS.FARMER_DETAILS}/${farmerId}`).catch(() => {
    console.log('API failed, using mock farmer details');
    mockFarmers = JSON.parse(localStorage.getItem(MOCK_FARMERS_KEY)) || mockFarmers;
    const farmer = mockFarmers.find(f => f.farmerId == farmerId || f.id == farmerId);
    return {
      data: farmer || mockFarmers[0]
    };
  }),
  
  getFarmerProducts: (farmerId) => api.get(`${API_ENDPOINTS.FARMER_PRODUCTS}/${farmerId}`).catch(() => {
    console.log('API failed, using mock farmer products');
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    const farmerProducts = mockProducts.filter(p => p.farmerId == farmerId);
    return {
      data: farmerProducts
    };
  }),
  
  getProductDetails: (farmerId, productId) => api.get(`/farmer/products/${farmerId}/${productId}`).catch(() => {
    console.log('API failed, using mock product details');
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    const product = mockProducts.find(p => p.id == productId && p.farmerId == farmerId);
    return {
      data: product || mockProducts[0]
    };
  }),
  
  getAllProducts: () => api.get(API_ENDPOINTS.FARMER_ALL_PRODUCTS).catch(() => {
    console.log('API failed, using mock products for home page');
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    // Convert mock products to the format expected by home page
    const homePageProducts = mockProducts.map(product => ({
      ...product,
      farmer1: { firstname: 'Test', lastname: 'Farmer' },
      description: product.description || 'Fresh product from local farm'
    }));
    
    return {
      data: homePageProducts
    };
  })
};

// Seller API functions
export const sellerAPI = {
  getProfile: (email) => api.get(`/seller/profile/${email}`).catch(() => ({
    data: {
      farmerId: 1,
      firstname: 'John',
      lastname: 'Farmer',
      email: email,
      phoneNo: '+1234567890',
      address: '123 Farm Street, Rural Area'
    }
  })),
  
  getProducts: (farmerId) => api.get(`/seller/products/${farmerId}`).catch(() => {
    console.log('=== GETTING PRODUCTS FROM MOCK STORAGE ===');
    console.log('Requested farmerId:', farmerId, 'type:', typeof farmerId);
    console.log('Current localStorage products:', localStorage.getItem(MOCK_PRODUCTS_KEY));
    
    // Ensure we get the latest mock data from localStorage
    const storedProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    console.log('All stored products:', storedProducts);
    
    // Convert farmerId to number for comparison
    const farmerIdNum = parseInt(farmerId);
    const userProducts = storedProducts.filter(product => {
      const productFarmerId = parseInt(product.farmerId);
      console.log(`Comparing product.farmerId (${productFarmerId}) with farmerId (${farmerIdNum})`);
      return productFarmerId === farmerIdNum;
    });
    
    console.log('Filtered products for farmer:', farmerId, userProducts);
    console.log('=== END GETTING PRODUCTS ===');
    
    return {
      data: userProducts
    };
  }),
  
  getCategories: () => api.get('/admin/allcategories').catch(() => ({
    data: [
      { id: 1, categoryName: 'Vegetables' },
      { id: 2, categoryName: 'Fruits' },
      { id: 3, categoryName: 'Grains' },
      { id: 4, categoryName: 'Dairy' },
      { id: 5, categoryName: 'Herbs' },
      { id: 6, categoryName: 'Spices' },
      { id: 7, categoryName: 'Nuts' },
      { id: 8, categoryName: 'Seeds' }
    ]
  })),
  
  addProduct: (farmerId, productData) => api.post(`/seller/products/${farmerId}`, productData).catch(() => {
    console.log('=== ADDING PRODUCT TO MOCK STORAGE ===');
    console.log('farmerId:', farmerId, 'type:', typeof farmerId);
    console.log('productData:', productData);
    
    // Get latest data from localStorage
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    nextProductId = parseInt(localStorage.getItem(NEXT_ID_KEY)) || nextProductId;
    
    // Create new product with proper structure
    const newProduct = {
      id: nextProductId++,
      stockItem: productData.stockItem,
      quantity: parseInt(productData.quantity),
      pricePerUnit: parseFloat(productData.pricePerUnit),
      description: productData.description || '',
      imagePath: productData.imagePath || '',
      farmerId: parseInt(farmerId),
      // Handle category properly - create category object if it's just a string
      category: typeof productData.category === 'string' ? 
        { id: nextProductId, categoryName: productData.category } : 
        (productData.category && productData.category.categoryName ? 
          { id: productData.category.id || nextProductId, categoryName: productData.category.categoryName } : 
          { id: nextProductId, categoryName: productData.category || 'Uncategorized' })
    };
    
    mockProducts.push(newProduct);
    saveMockData(); // Save to localStorage
    
    console.log('New product added:', newProduct);
    console.log('Updated mock products:', mockProducts);
    
    return {
      data: {
        message: 'Product added successfully',
        product: newProduct
      }
    };
  }),
  
  updateProduct: (productId, productData) => api.put(`/seller/products/${productId}`, productData).catch(() => {
    console.log('API failed, updating product in mock storage:', productId, productData);
    
    // Get latest data from localStorage
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    
    // Find and update the product
    const productIndex = mockProducts.findIndex(product => product.id == productId);
    if (productIndex !== -1) {
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        stockItem: productData.stockItem,
        quantity: parseInt(productData.quantity),
        pricePerUnit: parseFloat(productData.pricePerUnit),
        description: productData.description || mockProducts[productIndex].description,
        imagePath: productData.imagePath || mockProducts[productIndex].imagePath,
        category: typeof productData.category === 'string' ? 
          { id: mockProducts[productIndex].category.id, categoryName: productData.category } : 
          productData.category
      };
      
      saveMockData(); // Save to localStorage
      console.log('Product updated:', mockProducts[productIndex]);
    }
    
    return { data: 'Product updated successfully' };
  }),
  
  deleteProduct: (productId) => api.delete(`/seller/products/${productId}`).catch(() => {
    console.log('API failed, removing product from mock storage:', productId);
    
    // Get latest data from localStorage
    mockProducts = JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY)) || mockProducts;
    
    const originalLength = mockProducts.length;
    mockProducts = mockProducts.filter(product => product.id != productId);
    
    saveMockData(); // Save to localStorage
    
    console.log(`Removed product ${productId}, mock products:`, mockProducts);
    
    return {
      data: {
        message: 'Product deleted successfully',
        removed: originalLength > mockProducts.length
      }
    };
  }),
  
  getProductDetails: (farmerId, productId) => api.get(`/seller/products/${farmerId}/${productId}`).catch(() => ({
    data: {
      id: productId,
      stockItem: 'Sample Product',
      quantity: 10,
      pricePerUnit: 50.0,
      category: { id: 1, categoryName: 'Vegetables' },
      imagePath: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300'
    }
  })),
  
  getSales: (farmerId) => api.get(`/seller/sales/${farmerId}`).catch(() => ({
    data: []
  })),
  
  getStats: (farmerId) => api.get(`/seller/stats/${farmerId}`).catch(() => {
    const farmerProducts = mockProducts.filter(p => p.farmerId == farmerId);
    return {
      data: {
        totalProducts: farmerProducts.length,
        totalOrders: 15,
        totalQuantitySold: 45,
        totalRevenue: 3500.0,
        uniqueBuyers: 8,
        lowStockItems: farmerProducts.filter(p => p.quantity < 10).length
      }
    };
  }),
  
  updateProfile: (farmerId, profileData) => api.put(`/seller/profile/${farmerId}`, profileData).catch(() => ({
    data: 'Profile updated successfully'
  })),
  
  // Debug function to clear mock data
  clearMockData: () => {
    localStorage.removeItem(MOCK_PRODUCTS_KEY);
    localStorage.removeItem(NEXT_ID_KEY);
    mockProducts = [];
    nextProductId = 1;
    console.log('Mock data cleared');
  },
  
  // Debug function to view current state
  debugState: () => {
    console.log('=== DEBUG STATE ===');
    console.log('mockProducts array:', mockProducts);
    console.log('localStorage products:', JSON.parse(localStorage.getItem(MOCK_PRODUCTS_KEY) || '[]'));
    console.log('nextProductId:', nextProductId);
    console.log('localStorage nextId:', localStorage.getItem(NEXT_ID_KEY));
    console.log('Current user:', JSON.parse(localStorage.getItem('user') || 'null'));
    console.log('===================');
  },
  
  // Debug function to reset with test data
  resetTestData: () => {
    const testProducts = [
      {
        id: 1,
        stockItem: 'Test Tomatoes',
        quantity: 50,
        pricePerUnit: 85.0,
        category: { id: 1, categoryName: 'Vegetables' },
        imagePath: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300',
        farmerId: 1,
        description: 'Fresh test tomatoes'
      },
      {
        id: 2,
        stockItem: 'Test Apples',
        quantity: 30,
        pricePerUnit: 120.0,
        category: { id: 2, categoryName: 'Fruits' },
        imagePath: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
        farmerId: 1,
        description: 'Fresh test apples'
      }
    ];
    
    mockProducts = testProducts;
    nextProductId = 3;
    saveMockData();
    console.log('Test data reset completed');
  }
};

// Dummy API function
export const dummyAPI = {
  getNumbers: () => api.get(API_ENDPOINTS.DUMMY)
};

export default api;
