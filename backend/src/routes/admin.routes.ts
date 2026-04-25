import { Router } from 'express';
import adminService from '../services/admin.service.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const userUpdateSchema = z.object({
  role: z.enum(['CUSTOMER', 'ADMIN', 'VENDOR', 'SUPPORT']).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

const productCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
});

const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  shippingMethod: z.string().optional(),
});

// ============================================
// DASHBOARD ROUTES
// ============================================

// GET /api/v1/admin/dashboard - Get dashboard stats
router.get('/dashboard', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const data = await adminService.getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// GET /api/v1/admin/users - List all users
router.get('/users', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', search, role } = req.query;
    const data = await adminService.getUsers(
      parseInt(page as string),
      parseInt(limit as string),
      search as string,
      role as string
    );
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/users/:id - Get user details
router.get('/users/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// POST /api/v1/admin/users - Create new user
router.post('/users', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await adminService.createUser({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// PUT /api/v1/admin/users/:id - Update user
router.put('/users/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = userUpdateSchema.parse(req.body);
    const user = await adminService.updateUser(id, validatedData);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: error.errors });
      return;
    }
    next(error);
  }
});

// DELETE /api/v1/admin/users/:id - Delete user
router.delete('/users/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteUser(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// PRODUCT MANAGEMENT ROUTES
// ============================================

// GET /api/v1/admin/products - List all products
router.get('/products', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', status, search, category } = req.query;
    const data = await adminService.getProducts(
      parseInt(page as string),
      parseInt(limit as string),
      status as string,
      search as string,
      category as string
    );
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/products/:id - Get product details
router.get('/products/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const product = await adminService.getProductById(id);
    res.json({ success: true, data: product });
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// POST /api/v1/admin/products - Create new product
router.post('/products', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const data = req.body;
    const product = await adminService.createProduct(data);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/products/:id - Update product
router.put('/products/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await adminService.updateProduct(id, data);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/products/:id - Delete product
router.delete('/products/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteProduct(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/admin/products/:id/stock - Update product stock
router.patch('/products/:id/stock', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (typeof stock !== 'number' || stock < 0) {
      res.status(400).json({ success: false, message: 'Invalid stock value' });
      return;
    }

    const product = await adminService.updateProductStock(id, stock);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/products/bulk-update - Bulk update products
router.post('/products/bulk-update', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { ids, data } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'Product IDs are required' });
      return;
    }

    const result = await adminService.bulkUpdateProducts(ids, data);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================
// ORDER & LOGISTICS MANAGEMENT ROUTES
// ============================================

// GET /api/v1/admin/orders - List all orders
router.get('/orders', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', status, paymentStatus, userId } = req.query;
    const data = await adminService.getOrders(
      parseInt(page as string),
      parseInt(limit as string),
      status as string,
      paymentStatus as string,
      userId as string
    );
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/orders/:id - Get order details
router.get('/orders/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const order = await adminService.getOrderById(id);
    res.json({ success: true, data: order });
  } catch (error: any) {
    if (error.message === 'Order not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// PUT /api/v1/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = orderStatusUpdateSchema.parse(req.body);
    const order = await adminService.updateOrderStatus(id, validatedData);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Invalid data', errors: error.errors });
      return;
    }
    next(error);
  }
});

// PUT /api/v1/admin/orders/:id/payment-status - Update payment status
router.put('/orders/:id/payment-status', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      res.status(400).json({ success: false, message: 'Payment status is required' });
      return;
    }

    const order = await adminService.updateOrderPaymentStatus(id, paymentStatus);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/orders/:id/tracking - Add tracking info
router.post('/orders/:id/tracking', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier, shippingMethod } = req.body;
    
    if (!trackingNumber || !carrier) {
      res.status(400).json({ success: false, message: 'Tracking number and carrier are required' });
      return;
    }

    const order = await adminService.addTrackingInfo(id, { trackingNumber, carrier, shippingMethod });
    res.json({
      success: true,
      message: 'Tracking information added successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/orders/shipment/pending - Get orders pending shipment
router.get('/orders/shipment/pending', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { status } = req.query;
    const orders = await adminService.getOrdersForShipment(status as string);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/analytics/shipping - Get shipping analytics
router.get('/analytics/shipping', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const analytics = await adminService.getShippingAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ANALYTICS & REPORTS ROUTES
// ============================================

// GET /api/v1/admin/analytics/sales - Get sales analytics
router.get('/analytics/sales', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await adminService.getSalesAnalytics(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/reports/orders/export - Export orders
router.get('/reports/orders/export', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { format = 'csv', status, paymentStatus, startDate, endDate } = req.query;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.gte = new Date(startDate as string);
      if (endDate) filters.createdAt.lte = new Date(endDate as string);
    }

    const data = await adminService.exportOrders(format as 'csv' | 'json', filters);
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=orders-${Date.now()}.csv`);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=orders-${Date.now()}.json`);
    }
    
    res.send(data);
  } catch (error) {
    next(error);
  }
});

export default router;
