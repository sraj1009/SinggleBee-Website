import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../models/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export class AdminService {
  // ============================================
  // DASHBOARD STATISTICS
  // ============================================
  
  async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts, totalRevenue, recentOrders, lowStockProducts] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { take: 2 },
        },
      }),
      prisma.product.findMany({
        where: { 
          stock: { lte: 10 },
          status: 'ACTIVE',
        },
        take: 5,
        orderBy: { stock: 'asc' },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: Number(totalRevenue._sum.total || 0),
      },
      recentOrders,
      lowStockProducts,
    };
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  async getUsers(page: number, limit: number, search?: string, role?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          orders: {
            select: { id: true, total: true, status: true },
            take: 3,
          },
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: { take: 3 },
          },
        },
        reviews: {
          include: { product: { select: { name: true, image: true } } },
        },
        cart: {
          include: {
            items: {
              include: {
                product: { select: { name: true, images: { where: { isPrimary: true }, take: 1 } } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(id: string, data: { role?: string; isActive?: boolean; emailVerified?: boolean }) {
    const updateData: any = {};
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return user;
  }

  async createUser(data: { email: string; password: string; firstName?: string; lastName?: string; role?: string; phone?: string }) {
    const bcrypt = await import('bcryptjs');
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || 'CUSTOMER',
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Create cart for new user
    await prisma.cart.create({
      data: {
        id: uuidv4(),
        userId: user.id,
      },
    });

    return user;
  }

  async deleteUser(id: string) {
    await prisma.user.delete({ where: { id } });
    return { success: true, message: 'User deleted successfully' };
  }

  // ============================================
  // PRODUCT MANAGEMENT
  // ============================================
  
  async getProducts(page: number, limit: number, status?: string, search?: string, category?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) where.status = status;
    if (category) {
      where.categories = { some: { slug: category } };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: true,
          brand: true,
          images: { where: { isPrimary: true }, take: 1 },
          variants: { take: 3 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        brand: true,
        images: true,
        variants: true,
        options: true,
        reviews: {
          take: 5,
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async createProduct(data: any) {
    const { categories, images, variants, options, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categories: categories ? { connect: categories.map((id: string) => ({ id })) } : undefined,
        images: images ? { create: images } : undefined,
        variants: variants ? { create: variants } : undefined,
        options: options ? { create: options } : undefined,
      },
      include: {
        categories: true,
        images: true,
        variants: true,
      },
    });

    return product;
  }

  async updateProduct(id: string, data: any) {
    const { categories, images, variants, options, ...productData } = data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categories: categories ? { set: categories.map((catId: string) => ({ id: catId })) } : undefined,
        images: images ? {
          deleteMany: {},
          create: images,
        } : undefined,
      },
      include: {
        categories: true,
        images: true,
        variants: true,
      },
    });

    return product;
  }

  async deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    return { success: true, message: 'Product deleted successfully' };
  }

  async updateProductStock(id: string, stock: number) {
    const product = await prisma.product.update({
      where: { id },
      data: { stock },
    });
    return product;
  }

  async bulkUpdateProducts(ids: string[], data: any) {
    const updates = ids.map(id => 
      prisma.product.update({
        where: { id },
        data,
      })
    );

    await prisma.$transaction(updates);
    return { success: true, message: `${ids.length} products updated` };
  }

  // ============================================
  // ORDER & LOGISTICS MANAGEMENT
  // ============================================
  
  async getOrders(page: number, limit: number, status?: string, paymentStatus?: string, userId?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (userId) where.userId = userId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
          items: {
            include: {
              product: { select: { name: true, images: { where: { isPrimary: true }, take: 1 } } },
            },
          },
          payments: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { 
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true, 
            phone: true,
            addresses: true,
          } 
        },
        items: {
          include: {
            product: { 
              select: { 
                name: true, 
                images: true,
                sku: true,
              } 
            },
          },
        },
        payments: true,
        refunds: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, data: { status?: string; trackingNumber?: string; carrier?: string; shippingMethod?: string }) {
    const updateData: any = {};
    
    if (data.status) {
      updateData.status = data.status;
      
      // Auto-set timestamps based on status
      if (data.status === 'SHIPPED') {
        updateData.shippedAt = new Date();
      } else if (data.status === 'DELIVERED') {
        updateData.deliveredAt = new Date();
        updateData.fulfillmentStatus = 'FULFILLED';
      } else if (data.status === 'CANCELLED') {
        updateData.cancelledAt = new Date();
      }
    }
    
    if (data.trackingNumber) updateData.trackingNumber = data.trackingNumber;
    if (data.carrier) updateData.carrier = data.carrier;
    if (data.shippingMethod) updateData.shippingMethod = data.shippingMethod;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ORDER_STATUS_UPDATE',
        entity: 'Order',
        entityId: id,
        newValues: updateData,
      },
    });

    return order;
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: string) {
    const order = await prisma.order.update({
      where: { id },
      data: { 
        paymentStatus,
        paidAt: paymentStatus === 'PAID' ? new Date() : null,
      },
    });

    return order;
  }

  async addTrackingInfo(id: string, data: { trackingNumber: string; carrier: string; shippingMethod?: string }) {
    const order = await prisma.order.update({
      where: { id },
      data: {
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        shippingMethod: data.shippingMethod,
        status: 'SHIPPED',
        shippedAt: new Date(),
      },
    });

    return order;
  }

  async getOrdersForShipment(status?: string) {
    const orders = await prisma.order.findMany({
      where: {
        status: status || 'CONFIRMED',
        fulfillmentStatus: 'UNFULFILLED',
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { email: true, firstName: true, lastName: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, sku: true, weight: true } },
          },
        },
      },
    });

    return orders;
  }

  async getShippingAnalytics() {
    const [totalOrders, shippedOrders, deliveredOrders, avgDeliveryTime] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.aggregate({
        where: { 
          status: 'DELIVERED',
          shippedAt: { not: null },
          deliveredAt: { not: null },
        },
        _avg: {
          // Calculate delivery time in days
        },
      }),
    ]);

    return {
      totalOrders,
      shippedOrders,
      deliveredOrders,
      pendingShipment: totalOrders - shippedOrders,
      deliveryRate: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
    };
  }

  // ============================================
  // ANALYTICS & REPORTS
  // ============================================
  
  async getSalesAnalytics(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [dailySales, topProducts, salesByCategory] = await Promise.all([
      prisma.order.groupBy({
        by: ['createdAt'],
        where: { ...where, paymentStatus: 'PAID' },
        _sum: { total: true },
        _count: true,
        take: 30,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.orderItem.groupBy({
        by: ['productId', 'name'],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: 'desc' } },
        take: 10,
      }),
      prisma.category.findMany({
        include: {
          products: {
            include: {
              orderItems: {
                where: { order: where },
                _sum: { quantity: true, total: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      dailySales,
      topProducts,
      salesByCategory,
    };
  }

  async exportOrders(format: 'csv' | 'json', filters?: any) {
    const orders = await prisma.order.findMany({
      where: filters,
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'json') {
      return JSON.stringify(orders, null, 2);
    }

    // CSV format
    const headers = ['Order ID', 'Order Number', 'Customer', 'Email', 'Total', 'Status', 'Payment Status', 'Created At'];
    const rows = orders.map(o => [
      o.id,
      o.orderNumber,
      `${o.user.firstName} ${o.user.lastName}`,
      o.user.email,
      o.total.toString(),
      o.status,
      o.paymentStatus,
      o.createdAt.toISOString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export default new AdminService();
