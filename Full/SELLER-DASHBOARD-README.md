# Farmers Marketplace - Seller Dashboard

## Overview
The Seller Dashboard is a comprehensive product management system that allows farmers/sellers to manage their products, track sales, and monitor their business performance in the Farmers Marketplace application.

## Features

### 🛍️ Product Management
- **Add New Products**: Create new product listings with details like name, quantity, price, category, and image
- **Edit Existing Products**: Update product information, pricing, and inventory levels
- **Delete Products**: Remove products from the marketplace
- **View Product Inventory**: Monitor stock levels with visual indicators for low stock items

### 📊 Dashboard Analytics
- **Quick Stats Overview**: View key metrics at a glance
  - Total Products
  - Total Revenue
  - Total Sales
  - Low Stock Alerts
- **Sales & Analytics Tab**: Detailed performance metrics
- **Revenue Tracking**: Monitor total earnings from sales

### 🎨 User Interface
- **Material-UI Design**: Modern, responsive interface with consistent theming
- **Tabbed Interface**: Organized sections for Products and Analytics
- **Data Tables**: Sortable and interactive product listings
- **Dialog Forms**: Intuitive add/edit product forms
- **Visual Indicators**: Status chips for stock levels (In Stock, Low Stock, Out of Stock)

## Technical Implementation

### Frontend (React)
**File Location**: `src/components/SellerDashboard.jsx`

**Key Components**:
- Dashboard statistics cards
- Product management table
- Add/Edit product dialog
- Tabs for different sections
- Snackbar notifications for user feedback

**Dependencies**:
- Material-UI components
- React Router for navigation
- Context API for authentication
- Axios for API calls

### Backend (Spring Boot)
**Controller**: `src/main/java/com/marketplace/controller/SellerController.java`

**API Endpoints**:
```
GET /seller/profile/{email}          - Get seller profile
GET /seller/categories               - Get all product categories
GET /seller/products/{farmerId}      - Get seller's products
POST /seller/products/{farmerId}     - Add new product
PUT /seller/products/{productId}     - Update existing product
DELETE /seller/products/{productId}  - Delete product
GET /seller/stats/{farmerId}         - Get seller statistics
GET /seller/sales/{farmerId}         - Get sales data
```

**Service Layer**: `src/main/java/com/marketplace/service/FarmersServiceImpl.java`
- Product CRUD operations
- Statistics calculation
- Sales data retrieval

**DAO Layer**: `src/main/java/com/marketplace/dao/FarmersDaoImpl.java`
- Database operations using JPA/Hibernate
- Complex queries for statistics and sales data

## How to Use

### 1. Access the Dashboard
- Navigate to `/test-login` for testing purposes
- Click "Login as Seller" to access the seller dashboard
- Or use the regular login with seller credentials

### 2. View Dashboard Overview
- See your key performance metrics in the stats cards
- Monitor products, revenue, and stock levels at a glance

### 3. Manage Products
- **Add Product**: Click "Add New Product" button
  - Fill in product name, quantity, price per unit
  - Select category from dropdown
  - Optionally add image URL
  - Click "Add Product" to save

- **Edit Product**: Click the edit icon (pencil) on any product row
  - Modify any product details
  - Click "Update Product" to save changes

- **Delete Product**: Click the delete icon (trash) on any product row
  - Confirm deletion in the popup dialog

### 4. Monitor Inventory
- Products with quantity < 10 show "Low Stock" warning
- Out of stock items (quantity = 0) are highlighted
- Use the quantity column to track inventory levels

### 5. View Analytics
- Switch to "Sales & Analytics" tab
- Review detailed statistics about your business
- Monitor total revenue and sales performance

## Data Models

### Product (StockDetails)
```json
{
  "id": 1,
  "stockItem": "Product Name",
  "quantity": 50,
  "pricePerUnit": 85.0,
  "category": {
    "id": 1,
    "categoryName": "Vegetables"
  },
  "imagePath": "URL to product image"
}
```

### Seller Statistics
```json
{
  "totalProducts": 10,
  "totalOrders": 25,
  "totalQuantitySold": 150,
  "totalRevenue": 5000.0,
  "uniqueBuyers": 12
}
```

## Authentication & Security

### Protected Routes
- Seller dashboard is protected by `ProtectedRoute` component
- Requires user to be logged in with `userType: 'SELLER'`
- Redirects unauthorized users to login page

### User Context
The seller dashboard expects user object with:
```json
{
  "userId": 1,
  "farmerId": 1,
  "name": "Seller Name",
  "email": "seller@example.com",
  "userType": "SELLER"
}
```

## API Integration

### Error Handling
- Graceful fallback to mock data when backend is unavailable
- User-friendly error messages via snackbar notifications
- Loading states during API calls

### Mock Data
For testing without backend, the API includes fallback mock data:
- Sample products with realistic data
- Category dropdown options
- Sample statistics

## Backend Setup

### Database Requirements
- Products table (`stock_details`)
- Categories table (`category`)
- Farmers table (`farmer`)
- Orders and order details for statistics

### Key Backend Features
- Full CRUD operations for products
- Statistics calculation using JPA queries
- Cross-origin support for React frontend
- Error handling and validation

## Testing

### Quick Test Setup
1. Start the React development server: `npm run dev`
2. Navigate to `http://localhost:5174/test-login`
3. Click "Login as Seller"
4. Test all dashboard features with mock data

### With Backend
1. Start Spring Boot application: `./mvnw spring-boot:run`
2. Ensure database is configured and running
3. Use real seller credentials to login
4. Full functionality with persistent data

## Future Enhancements

### Planned Features
- 📸 **Image Upload**: Direct image upload for products
- 📈 **Advanced Analytics**: Charts and graphs for sales trends
- 🔔 **Notifications**: Real-time alerts for low stock and new orders
- 📱 **Mobile Optimization**: Enhanced mobile responsiveness
- 🏷️ **Batch Operations**: Bulk edit/delete products
- 💰 **Pricing Tools**: Dynamic pricing suggestions
- 📦 **Inventory Management**: Advanced stock tracking with alerts

### Technical Improvements
- Real-time data updates using WebSockets
- Advanced filtering and searching
- Export functionality for reports
- Multi-language support
- Dark mode theme option

## Troubleshooting

### Common Issues
1. **"No products found"**: Check if seller is properly logged in with farmerId
2. **API errors**: Verify backend is running and CORS is configured
3. **Loading indefinitely**: Check browser console for JavaScript errors
4. **Categories not loading**: Ensure admin has created product categories

### Development Tips
- Use browser developer tools to inspect API calls
- Check console for error messages
- Verify user authentication state in React DevTools
- Test with different user types using the test login page

## Contributing
When adding new features to the seller dashboard:
1. Update both frontend and backend components
2. Add proper error handling and loading states
3. Include user feedback via snackbar notifications
4. Update this documentation
5. Test with both mock and real data
