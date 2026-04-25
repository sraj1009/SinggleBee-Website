# 🐝 SinggleBee E-Commerce Platform

A professional, production-ready full-stack e-commerce platform built with modern technologies.

## 🚀 Quick Start

### One-Command Setup (Recommended)

```bash
# Install dependencies, setup database, and start all services
npm run full-stack
```

Or use the shell script:
```bash
./start-fullstack.sh
```

### Manual Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup database
npm run db:setup

# 3. Start all services (in separate terminals or use concurrently)
npm run dev:all
```

## 📦 What's Included

| Service | URL | Description |
|---------|-----|-------------|
| 🔙 Backend API | http://localhost:3000 | RESTful API with Express |
| 👨‍💼 Admin Dashboard | http://localhost:5174 | React admin panel |
| 🛒 Storefront | http://localhost:5173 | Customer-facing store |

## 🔐 Admin Credentials

```
Email:    admin@singglebee.com
Password: Secure#DB_2026!Access
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run full-stack` | Install deps, setup DB, and start all services |
| `npm run dev:all` | Start all services concurrently |
| `npm run backend` | Start backend only |
| `npm run admin` | Start admin dashboard only |
| `npm run dev` | Start storefront only |
| `npm run db:setup` | Generate Prisma client, migrate, and seed |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `./start-fullstack.sh` | Interactive startup script |

## 🏗️ Tech Stack

### Frontend
- **Storefront**: React 19, TypeScript, Vite, Tailwind CSS 4
- **Admin Dashboard**: React 18, TypeScript, Vite, Tailwind CSS, Recharts

### Backend
- Node.js, Express, TypeScript
- Prisma ORM with PostgreSQL
- JWT Authentication
- Zod Validation
- Stripe Payment Integration

### Database
- PostgreSQL with Prisma Schema
- 16+ models for complete e-commerce functionality

## 📁 Project Structure

```
singglebee/
├── backend/           # Backend API
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   └── middleware/
│   └── prisma/        # Database schema & migrations
├── admin/             # Admin Dashboard
│   └── src/
│       ├── pages/     # Dashboard pages
│       ├── layouts/   # Layout components
│       └── services/  # API client
├── src/               # Storefront (Customer-facing)
├── package.json       # Root package with scripts
├── start-fullstack.sh # Startup script
└── README.md          # This file
```

## 🔑 Features

### Customer Features
- Product browsing with search & filters
- Shopping cart & wishlist
- User reviews & ratings
- Coupon codes & discounts
- Multi-step checkout
- Order tracking
- Profile & address management

### Admin Features
- Dashboard analytics
- Product management (CRUD, bulk operations)
- User management & roles
- Order & logistics management
- Sales reports & exports
- Inventory management

## 🌍 Environment Variables

Create `.env` files in each directory:

**backend/.env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/singglebee"
JWT_SECRET="your-secret-key"
PORT=3000
STRIPE_SECRET_KEY="sk_test_..."
```

**admin/.env:**
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

**.env (root):**
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## 📝 License

MIT License - See LICENSE file for details.

---

Built with ❤️ by SinggleBee Team
