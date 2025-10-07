# Farmers Marketplace - Full Stack Application

## Project Overview

This is a complete full-stack web application for a Farmers Marketplace where users can browse and purchase fresh products directly from local farmers. The application consists of a Spring Boot backend API and a React frontend.

## Architecture

### Backend (Spring Boot)
- **Location**: `FarmersMarketPlace/`
- **Framework**: Spring Boot 3.5.3
- **Database**: H2 (configured for development), MySQL support available
- **Port**: 8080
- **Context Path**: `/FarmersMarketplace`

### Frontend (React + Vite)
- **Location**: `Frontend/farmers-market-frontend/`
- **Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI)
- **Port**: 5173

## Backend API Endpoints

### User Endpoints (`/user`)
- `POST /user/register` - User registration
- `POST /user/login` - User authentication
- `POST /user/addtocart/{productid}?qty={quantity}` - Add product to cart
- `GET /user/checkout` - Get cart items
- `POST /user/removefromcart/{productid}` - Remove item from cart
- `POST /user/placeorder` - Place order
- `GET /user/getorders` - Get user's orders

### Farmer Endpoints (`/farmer`)
- `GET /farmer/list` - Get all farmers
- `GET /farmer/farmerdetails/{farmerid}` - Get farmer details
- `GET /farmer/products/{farmerid}` - Get products by farmer
- `GET /farmer/products/{farmerid}/{productid}` - Get specific product details
- `GET /farmer/allproducts` - Get all products from all farmers

### Admin Endpoints (`/admin`)
- `POST /admin/newfarmer` - Add new farmer
- `POST /admin/newproduct/{farmerid}` - Add new product for farmer
- `POST /admin/{productid}/image` - Upload product image
- `GET /admin/{productid}` - Download product image
- `GET /admin/removefarmer/{farmerid}` - Remove farmer
- `GET /admin/removeproduct/{productid}` - Remove product
- `PUT /admin/updateproduct/{productid}` - Update product details
- `GET /admin/allfarmers` - Get all farmers (admin view)
- `GET /admin/allproducts` - Get all products (admin view)
- `GET /admin/allcategories` - Get all categories
- `GET /admin/allusers` - Get all users
- `GET /admin/allorders` - Get all orders

## Frontend Features

### User Features
1. **Authentication**
   - User registration with form validation
   - User login with error handling
   - Persistent login state using localStorage
   - Protected routes for authenticated users

2. **Product Browsing**
   - View all products from farmers
   - Search products by name or category
   - Product images with fallback
   - Product details including farmer information

3. **Shopping Cart**
   - Add products to cart with quantity selection
   - View cart items with total calculation
   - Remove items from cart
   - Quantity adjustment controls

4. **Order Management**
   - Place orders from cart
   - View order history
   - Order status tracking

### Admin Features
1. **Farmer Management**
   - Add new farmers
   - View all farmers
   - Remove farmers

2. **Product Management**
   - Add new products
   - View all products
   - Remove products
   - Upload product images

## Data Models

### User
- userId (Integer, Primary Key)
- email (String, Unique)
- password (String)
- phoneNo (String)
- address (String)
- firstname (String)
- lastname (String)
- isadmin (Boolean)

### Farmer
- farmerId (Integer, Primary Key)
- firstname (String)
- lastname (String)
- email (String)
- phoneNo (String, Unique)
- address (String)

### StockDetails (Product)
- id (Integer, Primary Key)
- stockItem (String, Product Name)
- quantity (Integer)
- pricePerUnit (Float)
- category (Category Reference)
- farmer1 (Farmer Reference)
- imagePath (String)

### Category
- categoryId (Integer, Primary Key)
- categoryName (String)

## Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- MySQL (optional, H2 is configured by default)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd FarmersMarketPlace
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   or
   ```bash
   mvn spring-boot:run
   ```

3. The backend will be available at `http://localhost:8080/FarmersMarketplace`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend/farmers-market-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The frontend will be available at `http://localhost:5173`

## Database Configuration

### Current Configuration (H2)
```properties
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=root
spring.datasource.password=rizwankhan_02
spring.jpa.hibernate.ddl-auto=create-drop
```

### For MySQL Production
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/farmersmarket
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

## API Testing

You can test the API endpoints using tools like Postman or curl. Here are some example requests:

### Register a new user:
```bash
curl -X POST http://localhost:8080/FarmersMarketplace/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNo": "1234567890",
    "address": "123 Main St",
    "isadmin": false
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/FarmersMarketplace/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get all products:
```bash
curl -X GET http://localhost:8080/FarmersMarketplace/farmer/allproducts
```

## Security Features

- CORS configuration allows requests from `http://localhost:3000` (you may need to update this to `http://localhost:5173` for the Vite dev server)
- Input validation on forms
- Protected routes based on authentication status
- Admin-only routes for administrative functions

## Future Enhancements

1. **Authentication Improvements**
   - JWT token-based authentication
   - Password hashing and security
   - Email verification

2. **Payment Integration**
   - Payment gateway integration
   - Order tracking
   - Invoice generation

3. **Advanced Features**
   - Real-time notifications
   - Product reviews and ratings
   - Advanced search and filtering
   - Inventory management

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update the `@CrossOrigin` annotation in controllers to match your frontend URL
2. **Database Connection**: Check database configuration in `application.properties`
3. **Port Conflicts**: Ensure ports 8080 (backend) and 5173 (frontend) are available

### Development Tips

1. **Hot Reload**: Both frontend (Vite) and backend (Spring Boot DevTools) support hot reload
2. **API Testing**: Use browser developer tools or Postman to test API endpoints
3. **Database Inspection**: Access H2 console at `http://localhost:8080/h2-console` (if enabled)

## Project Status

✅ **Completed Features:**
- Backend API with all CRUD operations
- Frontend React application with routing
- User authentication and registration
- Product browsing and cart functionality
- Admin panel for management
- Responsive Material-UI design

🔄 **In Development:**
- Order management completion
- Image upload/download optimization
- Enhanced error handling

## License

This project is licensed under the MIT License.
