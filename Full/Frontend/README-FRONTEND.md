# Farmers Marketplace Frontend

A modern React frontend for the Farmers Marketplace application built with Vite and Material-UI.

## Features

- **User Authentication**: Register and login functionality
- **Product Browsing**: View all available products from farmers
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Management**: Place orders and view order history
- **Admin Panel**: Admin users can manage farmers, products, and orders
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **Material-UI (MUI)**: Component library for UI
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Context API**: State management for auth and cart

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

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

4. Open your browser and navigate to `http://localhost:5173`

## Backend Integration

This frontend is designed to work with the Spring Boot backend API. Make sure the backend is running on `http://localhost:8080/FarmersMarketplace`.

### API Endpoints Used

- **User Endpoints**:
  - `POST /user/register` - User registration
  - `POST /user/login` - User login
  - `POST /user/addtocart/{productid}` - Add product to cart
  - `GET /user/checkout` - Get cart items
  - `POST /user/removefromcart/{productid}` - Remove from cart
  - `POST /user/placeorder` - Place order
  - `GET /user/getorders` - Get user orders

- **Farmer Endpoints**:
  - `GET /farmer/list` - Get all farmers
  - `GET /farmer/farmerdetails/{farmerid}` - Get farmer details
  - `GET /farmer/products/{farmerid}` - Get farmer products
  - `GET /farmer/allproducts` - Get all products

- **Admin Endpoints**:
  - `POST /admin/newfarmer` - Add new farmer
  - `POST /admin/newproduct/{farmerid}` - Add new product
  - `GET /admin/removefarmer/{farmerid}` - Remove farmer
  - `GET /admin/removeproduct/{productid}` - Remove product

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.jsx       # Navigation header
│   ├── Home.jsx         # Product listing page
│   ├── Login.jsx        # Login form
│   ├── Register.jsx     # Registration form
│   ├── Cart.jsx         # Shopping cart
│   ├── Orders.jsx       # Order history
│   ├── Admin.jsx        # Admin panel
│   └── ProtectedRoute.jsx # Route protection
├── contexts/            # React contexts
│   ├── AuthContext.jsx  # Authentication state
│   └── CartContext.jsx  # Cart state
├── services/            # API services
│   └── api.js          # API endpoints and functions
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Implementation

### Authentication
- Users can register and login
- Authentication state is managed globally
- Protected routes require authentication
- Admin routes require admin privileges

### Shopping Experience
- Browse all products with search functionality
- Add products to cart with quantity selection
- View and manage cart items
- Place orders and view order history

### Admin Features
- Manage farmers (add/remove)
- Manage products (add/remove)
- View orders (coming soon)

## Environment Variables

Create a `.env` file in the root directory if you need to customize the backend URL:

```
VITE_API_BASE_URL=http://localhost:8080/FarmersMarketplace
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
