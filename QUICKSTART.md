# SinggleBee E-Commerce Platform - Quick Start Guide

## 🚀 One-Command Setup & Run

### Option 1: Using npm (Cross-platform)
```bash
npm run full-stack
```
This command will:
1. Install all backend dependencies
2. Install all admin dashboard dependencies
3. Set up the database with migrations and seed data
4. Display instructions to start the services

After running `npm run full-stack`, start the services:
```bash
# Terminal 1 - Backend API
cd backend && npm run dev

# Terminal 2 - Admin Dashboard
cd admin && npm run dev

# Terminal 3 - Storefront
npm run dev
```

### Option 2: Using Shell Script (Linux/Mac/WSL)
```bash
./start-fullstack.sh
```
This script automatically:
- Checks and installs dependencies if needed
- Sets up the database if not already done
- Starts all three services concurrently
- Displays connection information

---

## 📋 Manual Setup (Step by Step)

### 1. Backend Setup
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```
Backend runs on: **http://localhost:3000**

### 2. Admin Dashboard Setup
```bash
cd admin
npm install
npm run dev
```
Admin Dashboard runs on: **http://localhost:5174**

### 3. Storefront Setup
```bash
# From root directory
npm install
npm run dev
```
Storefront runs on: **http://localhost:5173**

---

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@singglebee.com |
| **Password** | Secure#DB_2026!Access |

---

## 🛠️ Available Commands

### Root Directory
| Command | Description |
|---------|-------------|
| `npm run full-stack` | Install all dependencies and set up database |
| `npm run dev` | Start storefront development server |
| `npm run build` | Build storefront for production |
| `npm run preview` | Preview production build |
| `./start-fullstack.sh` | Start all services concurrently (Unix only) |

### Backend (`cd backend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npm run db:setup` | Run migrations and seed |
| `npm run prisma:studio` | Open Prisma Studio GUI |

### Admin (`cd admin`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
singglebee/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── validators/      # Zod schemas
│   │   └── utils/           # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Sample data
│   └── package.json
│
├── admin/                   # React Admin Dashboard
│   ├── src/
│   │   ├── pages/           # Dashboard pages
│   │   ├── layouts/         # Layout components
│   │   ├── services/        # API client
│   │   ├── hooks/           # Custom hooks
│   │   └── types/           # TypeScript interfaces
│   └── package.json
│
├── components/              # Storefront components
├── services/                # Storefront services
├── assets/                  # Images and static files
└── package.json
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/singglebee?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# CORS
FRONTEND_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"
```

---

## 🎯 Features Included

### Customer-Facing (Storefront)
- ✅ Product catalog with search & filters
- ✅ Product details & reviews
- ✅ Shopping cart
- ✅ Wishlist
- ✅ User authentication
- ✅ Checkout process
- ✅ Order history
- ✅ Coupon/discount codes
- ✅ Responsive design

### Admin Dashboard
- ✅ Dashboard analytics
- ✅ Product management (CRUD)
- ✅ Inventory management
- ✅ User management
- ✅ Order management
- ✅ Logistics & tracking
- ✅ Role-based access control
- ✅ Export reports (CSV/JSON)

### Backend API
- ✅ RESTful API (50+ endpoints)
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Payment integration (Stripe)
- ✅ Audit logging
- ✅ Error handling

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
cd backend
# Reset database
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 5174
lsof -ti:5174 | xargs kill -9
```

### Clear Cache and Reinstall
```bash
# Remove node_modules and lock files
rm -rf backend/node_modules admin/node_modules node_modules
rm -rf backend/package-lock.json admin/package-lock.json package-lock.json

# Reinstall
npm run full-stack
```

---

## 📞 Support

For issues or questions, check:
- `ECOMMERCE_DOCUMENTATION.md` - Full API documentation
- `backend/README.md` - Backend setup guide
- `admin/README.md` - Admin dashboard guide
- `backend/ADMIN_API.md` - Admin API reference
