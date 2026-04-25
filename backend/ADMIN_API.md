# Admin Dashboard API Documentation

## Overview

This document describes the admin dashboard API endpoints for managing products, users, and logistics in the SinggleBee e-commerce platform.

## Authentication

All admin endpoints require:
1. Valid JWT access token in the `Authorization` header: `Bearer <token>`
2. User must have `ADMIN` role

### Admin Login Credentials

```
Email: admin@singglebee.com
Password: Secure#DB_2026!Access
```

## Base URL

```
http://localhost:3000/api/v1/admin
```

---

## Dashboard Endpoints

### Get Dashboard Statistics

**GET** `/dashboard`

Returns overview statistics including total users, orders, products, revenue, recent orders, and low stock alerts.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalOrders": 320,
      "totalProducts": 85,
      "totalRevenue": 45000.00
    },
    "recentOrders": [...],
    "lowStockProducts": [...]
  }
}
```

---

## User Management

### List Users

**GET** `/users?page=1&limit=20&search=&role=`

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by email, first name, or last name
- `role`: Filter by role (CUSTOMER, ADMIN, VENDOR, SUPPORT)

### Get User Details

**GET** `/users/:id`

Returns complete user information including addresses, orders, reviews, and cart.

### Create User

**POST** `/users`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

### Update User

**PUT** `/users/:id`

**Body:**
```json
{
  "role": "ADMIN",
  "isActive": true,
  "emailVerified": true
}
```

### Delete User

**DELETE** `/users/:id`

---

## Product Management

### List Products

**GET** `/products?page=1&limit=20&status=&search=&category=`

Query Parameters:
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status (DRAFT, ACTIVE, ARCHIVED, OUT_OF_STOCK)
- `search`: Search by name, SKU, or description
- `category`: Filter by category slug

### Get Product Details

**GET** `/products/:id`

Returns complete product information including images, variants, options, and reviews.

### Create Product

**POST** `/products`

**Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "shortDescription": "Short description",
  "price": 29.99,
  "comparePrice": 39.99,
  "cost": 15.00,
  "sku": "PROD-001",
  "stock": 100,
  "status": "ACTIVE",
  "categoryId": "uuid-here",
  "brandId": "uuid-here",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "altText": "Product image",
      "isPrimary": true
    }
  ],
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description"
}
```

### Update Product

**PUT** `/products/:id`

Same body as create product.

### Delete Product

**DELETE** `/products/:id`

### Update Product Stock

**PATCH** `/products/:id/stock`

**Body:**
```json
{
  "stock": 50
}
```

### Bulk Update Products

**POST** `/products/bulk-update`

**Body:**
```json
{
  "ids": ["uuid-1", "uuid-2", "uuid-3"],
  "data": {
    "status": "ACTIVE",
    "isOnSale": true
  }
}
```

---

## Order & Logistics Management

### List Orders

**GET** `/orders?page=1&limit=20&status=&paymentStatus=&userId=`

Query Parameters:
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by order status (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `paymentStatus`: Filter by payment status (PENDING, AUTHORIZED, PAID, FAILED, REFUNDED)
- `userId`: Filter by specific user

### Get Order Details

**GET** `/orders/:id`

Returns complete order information including items, user details, payments, and refunds.

### Update Order Status

**PUT** `/orders/:id/status`

**Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784",
  "carrier": "UPS",
  "shippingMethod": "Ground"
}
```

Status transitions automatically set timestamps:
- `SHIPPED` → sets `shippedAt`
- `DELIVERED` → sets `deliveredAt` and `fulfillmentStatus`
- `CANCELLED` → sets `cancelledAt`

### Update Payment Status

**PUT** `/orders/:id/payment-status`

**Body:**
```json
{
  "paymentStatus": "PAID"
}
```

### Add Tracking Information

**POST** `/orders/:id/tracking`

**Body:**
```json
{
  "trackingNumber": "1Z999AA10123456784",
  "carrier": "UPS",
  "shippingMethod": "Ground"
}
```

Automatically updates order status to `SHIPPED`.

### Get Pending Shipments

**GET** `/orders/shipment/pending?status=CONFIRMED`

Returns all orders that need to be shipped.

### Get Shipping Analytics

**GET** `/analytics/shipping`

Returns shipping metrics including delivery rates and pending shipments.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 320,
    "shippedOrders": 280,
    "deliveredOrders": 250,
    "pendingShipment": 40,
    "deliveryRate": 78.125
  }
}
```

---

## Analytics & Reports

### Get Sales Analytics

**GET** `/analytics/sales?startDate=&endDate=`

Query Parameters:
- `startDate`: ISO date string (e.g., "2024-01-01")
- `endDate`: ISO date string

Returns daily sales data, top-selling products, and sales by category.

### Export Orders

**GET** `/reports/orders/export?format=csv&status=&paymentStatus=&startDate=&endDate=`

Query Parameters:
- `format`: `csv` or `json` (default: csv)
- `status`: Filter by order status
- `paymentStatus`: Filter by payment status
- `startDate`: Filter by start date
- `endDate`: Filter by end date

Returns downloadable file with order data.

---

## Order Statuses

| Status | Description |
|--------|-------------|
| PENDING | Order placed, awaiting confirmation |
| CONFIRMED | Order confirmed by admin |
| PROCESSING | Being prepared for shipment |
| SHIPPED | Package shipped with tracking |
| DELIVERED | Successfully delivered |
| CANCELLED | Order cancelled |
| REFUNDED | Fully refunded |
| PARTIALLY_REFUNDED | Partially refunded |

## Payment Statuses

| Status | Description |
|--------|-------------|
| PENDING | Payment initiated |
| AUTHORIZED | Payment authorized, not captured |
| PAID | Payment completed |
| FAILED | Payment failed |
| REFUNDED | Fully refunded |
| PARTIALLY_REFUNDED | Partially refunded |

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

---

## Setup Instructions

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Seed admin user:
   ```bash
   npm run prisma:seed
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

7. Login with admin credentials at `/api/v1/auth/login`
