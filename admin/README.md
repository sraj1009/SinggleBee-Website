# SinggleBee Admin Dashboard

Professional admin dashboard for the SinggleBee e-commerce platform.

## Features

- **Dashboard**: Real-time statistics, recent orders, low stock alerts
- **Products Management**: Full CRUD operations, search, filter, bulk actions
- **Orders & Logistics**: Order tracking, status updates, shipping management
- **User Management**: Role-based access control, user status management
- **Analytics**: Sales reports, export functionality (CSV/JSON)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Lucide Icons, Recharts
- **State**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Setup

### Prerequisites

- Node.js 18+ 
- Backend server running on port 3000

### Installation

```bash
cd admin
npm install
```

### Configuration

Create `.env` file:

```env
VITE_API_URL=/api/v1
```

### Development

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5174`

### Build

```bash
npm run build
```

## Default Admin Credentials

```
Email: admin@singglebee.com
Password: Secure#DB_2026!Access
```

## Project Structure

```
admin/
├── src/
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Layout components (AdminLayout)
│   ├── pages/          # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── UsersPage.tsx
│   │   └── OrdersPage.tsx
│   ├── services/       # API client
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## API Integration

The admin dashboard connects to the backend API at `/api/v1/admin/*`:

| Endpoint | Description |
|----------|-------------|
| `GET /admin/dashboard` | Dashboard statistics |
| `GET /admin/products` | List products with pagination |
| `POST /admin/products` | Create new product |
| `PUT /admin/products/:id` | Update product |
| `DELETE /admin/products/:id` | Delete product |
| `GET /admin/users` | List users |
| `PUT /admin/users/:id` | Update user |
| `GET /admin/orders` | List orders |
| `PUT /admin/orders/:id/status` | Update order status |
| `POST /admin/orders/:id/tracking` | Add tracking info |
| `GET /admin/reports/orders/export` | Export orders |

## Authentication

- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh on 401 responses
- Protected routes redirect to login

## License

MIT
