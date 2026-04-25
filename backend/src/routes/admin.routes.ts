import { Router } from 'express';
import { prisma } from '../models/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/v1/admin/dashboard - Get dashboard stats
router.get('/dashboard', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const [totalUsers, totalOrders, totalProducts, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
    ]);

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { take: 2 },
      },
    });

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: { 
        stock: { lte: 10 },
        status: 'ACTIVE',
      },
      take: 5,
      orderBy: { stock: 'asc' },
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrders,
          totalProducts,
          totalRevenue: Number(totalRevenue._sum.total || 0),
        },
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/users - List all users
router.get('/users', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', search, role } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/users/:id - Update user
router.put('/users/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { role, isActive, emailVerified } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role, isActive, emailVerified },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
      },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/orders - List all orders
router.get('/orders', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', status, paymentStatus } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          items: { take: 3 },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (carrier) updateData.carrier = carrier;
    if (status === 'SHIPPED') updateData.shippedAt = new Date();
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/products - List all products (including drafts)
router.get('/products', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '20', status, search } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          categories: true,
          brand: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
