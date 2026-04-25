# SinggleBee E-Commerce Platform - Complete Documentation

## 🚀 Full-Stack E-Commerce Solution for Startups

A production-ready, enterprise-grade e-commerce platform built with modern technologies.

---

## 📋 Table of Contents

1. [Features Overview](#features-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Admin Dashboard](#admin-dashboard)
7. [Setup Instructions](#setup-instructions)
8. [Environment Variables](#environment-variables)

---

## ✨ Features Overview

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer, Admin, Vendor, Support)
- Password hashing with bcrypt
- Protected routes middleware
- Session management

### 👥 Customer Features
- **User Account**
  - Registration & login
  - Profile management
  - Multiple addresses
  - Order history
  
- **Product Browsing**
  - Search & filtering (category, brand, price range)
  - Product details with images
  - Product variants (size, color, etc.)
  - Related products
  - Reviews & ratings (verified purchases)
  
- **Shopping Experience**
  - Shopping cart with real-time updates
  - Wishlist functionality
  - Coupon/discount codes
  - Multiple payment methods (Card, PayPal, Stripe, COD, Bank Transfer)
  - Order tracking
  - Order cancellation (when eligible)
  
- **Notifications**
  - Order updates
  - Promotional messages
  - System notifications
  - Read/unread status

### 🛍️ Admin Dashboard Features
- **Dashboard Analytics**
  - Total users, orders, revenue
  - Recent orders overview
  - Low stock alerts
  - Quick actions
  
- **Product Management**
  - CRUD operations
  - Bulk updates
  - Inventory management
  - Stock tracking
  - Image management
  - Category & brand assignment
  - Featured products toggle
  
- **User Management**
  - View all users
  - Search & filter
  - Role assignment
  - Activate/deactivate accounts
  - User details view
  
- **Order & Logistics**
  - Order list with filters
  - Order status updates
  - Tracking number management
  - Carrier selection
  - Shipping analytics
  - Export orders (CSV/JSON)
  
- **Promotions**
  - Coupon code management
  - Percentage & fixed discounts
  - Usage limits
  - Date-based validity
  
- **Content Management**
  - Review approval
  - Category management
  - Brand management

### 💳 Checkout & Payment
- Multi-step checkout process
- Address selection
- Shipping options calculation
- Tax calculation
- Coupon validation
- Payment intent creation
- Order confirmation
- Inventory deduction
- Email notifications (ready for integration)

### 📊 Analytics & Reporting
- Page view tracking
- Product view analytics
- Cart abandonment tracking
- Purchase analytics
- Sales reports
- Export functionality

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate limiting

### Frontend (Admin Dashboard)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context + Hooks

### Database
- **Primary**: PostgreSQL
- **Schema Management**: Prisma Migrate
- **Seeding**: Custom seed scripts

---

## 📁 Project Structure

```
/workspace/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seeding
│   ├── src/
│   │   ├── routes/
│   │   │   ├── index.ts           # Route aggregator
│   │   │   ├── auth.routes.ts     # Authentication routes
│   │   │   ├── admin.routes.ts    # Admin API routes
│   │   │   ├── customer.routes.ts # Customer API routes
│   │   │   ├── product.routes.ts  # Product routes
│   │   │   ├── cart.routes.ts     # Cart routes
│   │   │   ├── order.routes.ts    # Order routes
│   │   │   └── checkout.routes.ts # Checkout & payment
│   │   ├── services/
│   │   │   ├── auth.service.ts    # Auth business logic
│   │   │   ├── admin.service.ts   # Admin business logic
│   │   │   ├── customer.service.ts# Customer logic
│   │   │   ├── product.service.ts # Product logic
│   │   │   └── checkout.controller.ts # Checkout logic
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts # JWT verification
│   │   │   ├── error.middleware.ts# Error handling
│   │   │   └── validation.middleware.ts
│   │   ├── validators/
│   │   │   └── *.ts               # Zod schemas
│   │   ├── utils/
│   │   │   └── *.ts               # Helper functions
│   │   └── index.ts               # App entry point
│   ├── package.json
│   └── tsconfig.json
│
├── admin/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx      # Admin login
│   │   │   ├── DashboardPage.tsx  # Main dashboard
│   │   │   ├── ProductsPage.tsx   # Product management
│   │   │   ├── UsersPage.tsx      # User management
│   │   │   └── OrdersPage.tsx     # Order management
│   │   ├── layouts/
│   │   │   └── AdminLayout.tsx    # Sidebar & header
│   │   ├── components/
│   │   │   └── *.tsx              # Reusable UI components
│   │   ├── hooks/
│   │   │   ├── useAuth.ts         # Auth context
│   │   │   └── *.ts               # Custom hooks
│   │   ├── services/
│   │   │   └── api.ts             # API client
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript types
│   │   ├── App.tsx                # Router setup
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

---

## 🗄️ Database Schema

### Core Models

#### User
- Authentication & profile info
- Roles: CUSTOMER, ADMIN, VENDOR, SUPPORT
- Relationships: addresses, orders, reviews, cart, wishlist, notifications

#### Product
- Complete product information
- Variants support (size, color, etc.)
- Multiple images
- Inventory tracking
- Categories & brands
- Reviews & ratings

#### Order
- Complete order lifecycle
- Status: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
- Payment tracking
- Shipping & billing addresses
- Order items snapshot

#### Cart
- Real-time cart management
- Automatic total calculation
- Item quantity management

#### Additional Models
- **Address**: Multiple addresses per user
- **Category**: Hierarchical categories
- **Brand**: Product brands
- **Review**: Product reviews with verification
- **Coupon**: Discount codes with rules
- **Wishlist**: Saved products
- **Notification**: User notifications
- **AuditLog**: Admin action tracking
- **Analytics**: User behavior tracking

---

## 🌐 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| GET | `/me` | Get current user |
| POST | `/logout` | User logout |

### Customer (`/api/v1/customer`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (public) |
| GET | `/products/:slug` | Get product details |
| GET | `/categories` | List categories |
| GET | `/brands` | List brands |
| POST | `/reviews` | Create product review |
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist` | Add to wishlist |
| DELETE | `/wishlist/:productId` | Remove from wishlist |
| POST | `/coupons/validate` | Validate coupon code |
| GET | `/notifications` | Get notifications |
| PATCH | `/notifications/:id/read` | Mark as read |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |
| GET | `/addresses` | Get addresses |
| POST | `/addresses` | Add address |
| PUT | `/addresses/:id` | Update address |
| DELETE | `/addresses/:id` | Delete address |
| GET | `/orders` | Order history |
| GET | `/orders/:id` | Order details |
| POST | `/orders/:id/cancel` | Cancel order |

### Cart (`/api/v1/cart`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get cart |
| POST | `/items` | Add item to cart |
| PUT | `/items/:id` | Update cart item |
| DELETE | `/items/:id` | Remove item |
| DELETE | `/clear` | Clear cart |

### Checkout (`/api/v1/checkout`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/initiate` | Start checkout |
| POST | `/payment-intent` | Create payment |
| POST | `/confirm-payment` | Confirm payment |
| GET | `/shipping-options` | Get shipping options |
| POST | `/refund` | Process refund |

### Admin (`/api/v1/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard stats |
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| PATCH | `/products/:id/stock` | Update stock |
| POST | `/products/bulk-update` | Bulk update |
| GET | `/users` | List users |
| PUT | `/users/:id` | Update user |
| GET | `/orders` | List all orders |
| GET | `/orders/:id` | Order details |
| PUT | `/orders/:id/status` | Update status |
| POST | `/orders/:id/tracking` | Add tracking |
| GET | `/reports/orders/export` | Export orders |
| GET | `/analytics/sales` | Sales analytics |
| POST | `/coupons` | Create coupon |
| PUT | `/coupons/:id` | Update coupon |
| DELETE | `/coupons/:id` | Delete coupon |

---

## 🎛️ Admin Dashboard

### Access Credentials
```
Email: admin@singglebee.com
Password: Secure#DB_2026!Access
```

### Pages

#### 1. Dashboard (`/admin/dashboard`)
- Key metrics cards (Users, Orders, Revenue, Products)
- Recent orders table
- Low stock alerts
- Quick action buttons

#### 2. Products (`/admin/products`)
- Product list with search & filters
- Status filter (Active, Draft, Archived)
- Create/Edit product modal
- Stock management
- Bulk operations

#### 3. Users (`/admin/users`)
- User list with search
- Role filter
- User details view
- Role assignment
- Activate/Deactivate toggle

#### 4. Orders (`/admin/orders`)
- Order list with filters
- Status filter
- Order details view
- Status update workflow
- Tracking number management
- Export functionality

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (creates admin user + sample data)
npm run prisma:seed

# Start development server
npm run dev
```

Backend runs on: `http://localhost:3000`

### 2. Admin Frontend Setup

```bash
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Admin dashboard runs on: `http://localhost:5174`

### 3. Database Setup

Create PostgreSQL database:
```sql
CREATE DATABASE singglebee;
```

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/singglebee"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
NODE_ENV=development
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key-min-32-characters-long"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:5174"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Admin Frontend (.env)
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

---

## 📦 Available Scripts

### Backend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run db:setup         # Full DB setup (migrate + seed)
```

### Admin Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🔒 Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Input validation (Zod schemas)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (Helmet)
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Role-based access control
- ✅ Audit logging

---

## 📈 Scalability Features

- ✅ Stateless API design
- ✅ Database indexing on frequently queried fields
- ✅ Pagination on all list endpoints
- ✅ Efficient queries with Prisma
- ✅ Modular code structure
- ✅ Separation of concerns (routes, services, controllers)

---

## 🤝 Support

For issues or questions:
- Check the API documentation
- Review the database schema
- Inspect the service layer for business logic

---

## 📄 License

Proprietary - SinggleBee Platform

---

**Built with ❤️ for modern e-commerce**
