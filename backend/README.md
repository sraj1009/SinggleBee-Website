# SinggleBee E-commerce Backend API

A professional, production-ready e-commerce backend built with Node.js, Express, TypeScript, and Prisma ORM.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (Customer, Admin, Vendor, Support)
- Password hashing with bcrypt
- Secure session management

### 📦 Product Management
- Full CRUD operations for products
- Product variants and options support
- Category hierarchy
- Brand management
- Inventory tracking
- Product images and tags
- Advanced filtering and search

### 🛒 Shopping Cart
- Persistent cart per user
- Real-time price calculation
- Stock validation
- Cart item management

### 📋 Order Management
- Complete order lifecycle
- Multiple payment statuses
- Order tracking
- Automatic stock deduction
- Order cancellation with stock restoration

### 💳 Payment Integration
- Stripe payment integration
- Payment intent creation
- Webhook support (ready)
- Refund processing

### 👥 User Management
- User profiles
- Address management
- Order history
- Wishlist functionality

### 🔧 Admin Dashboard
- Dashboard statistics
- User management
- Order management
- Product management
- Low stock alerts

### 🛡️ Security Features
- Helmet security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection

### 📊 Additional Features
- Audit logging
- Analytics tracking
- Review and rating system
- Coupon/discount system
- Email verification (ready)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod
- **Payment**: Stripe
- **Security**: Helmet, CORS, express-rate-limit

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models & Prisma client
│   ├── validators/      # Zod schemas
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── config/              # Configuration files
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/change-password` - Change password

### Products
- `GET /api/v1/products` - List products (with filters)
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (Admin/Vendor)
- `PUT /api/v1/products/:id` - Update product (Admin/Vendor)
- `DELETE /api/v1/products/:id` - Delete product (Admin)
- `POST /api/v1/products/:id/stock` - Update stock (Admin/Vendor)

### Cart
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:itemId` - Update cart item
- `DELETE /api/v1/cart/items/:itemId` - Remove item
- `DELETE /api/v1/cart/clear` - Clear cart

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List user's orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders/:id/confirm-payment` - Confirm payment
- `POST /api/v1/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/users` - List users
- `PUT /api/v1/admin/users/:id` - Update user
- `GET /api/v1/admin/orders` - List all orders
- `PUT /api/v1/admin/orders/:id/status` - Update order status
- `GET /api/v1/admin/products` - List all products

## Database Schema

The application uses a comprehensive PostgreSQL schema including:

- Users & Authentication
- Products & Inventory
- Categories & Brands
- Orders & Payments
- Shopping Cart
- Reviews & Ratings
- Coupons & Discounts
- Audit Logs & Analytics

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `STRIPE_SECRET_KEY` - Stripe API key
- `PORT` - Server port
- `NODE_ENV` - Environment mode

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## License

MIT
