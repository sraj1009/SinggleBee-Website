import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const couponSchema = z.object({
  code: z.string().min(3).max(20),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxDiscountAmount: z.number().optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  isActive: z.boolean().default(true),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
});

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

const notificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['INFO', 'ORDER', 'PROMO', 'SYSTEM']).default('INFO'),
  link: z.string().optional(),
});

export class CustomerService {
  // Product browsing with filters
  async getProducts(filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { category, brand, minPrice, maxPrice, search, featured, page = 1, limit = 20 } = filters;
    
    const where: any = {
      status: 'ACTIVE',
      publishedAt: { not: null },
    };

    if (category) where.categoryId = category;
    if (brand) where.brandId = brand;
    if (featured) where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { position: 'asc' } },
          category: true,
          brand: true,
          variants: true,
          _count: { select: { reviews: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: true,
        category: true,
        brand: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw new Error('Product not found');

    // Track product view
    await prisma.analytics.create({
      data: {
        type: 'PRODUCT_VIEW',
        entityId: product.id,
        metadata: { slug },
      },
    });

    return product;
  }

  async getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
    if (!categoryId) return [];
    
    return prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId,
        status: 'ACTIVE',
        publishedAt: { not: null },
      },
      include: {
        images: { take: 1, orderBy: { position: 'asc' } },
      },
      take: limit,
    });
  }

  // Categories
  async getCategories() {
    return prisma.category.findMany({
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        products: {
          where: { status: 'ACTIVE' },
          include: { images: { take: 1 } },
        },
      },
    });
  }

  // Brands
  async getBrands() {
    return prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Reviews
  async createReview(userId: string, data: z.infer<typeof reviewSchema>) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new Error('Product not found');

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { productId: data.productId, userId },
    });
    if (existing) throw new Error('You have already reviewed this product');

    // Check if user purchased this product (verified review)
    const orderWithProduct = await prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['DELIVERED', 'OUT_FOR_DELIVERY'] },
        items: { some: { productId: data.productId } },
      },
    });

    const review = await prisma.review.create({
      data: {
        ...data,
        userId,
        isVerified: !!orderWithProduct,
        isApproved: false, // Require admin approval
      },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
    });

    return review;
  }

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { productId, isApproved: true } }),
    ]);

    return { reviews, total, page, limit };
  }

  // Wishlist
  async getWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId,
          items: { create: [] },
        },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
            },
          },
        },
      });
    }

    return wishlist;
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const item = await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
      include: { product: { include: { images: { take: 1 } } } },
    });

    return item;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) throw new Error('Wishlist not found');

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });

    return { success: true };
  }

  // Coupons
  async validateCoupon(code: string, userId: string, cartTotal: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) throw new Error('Invalid coupon code');
    if (!coupon.isActive) throw new Error('Coupon is inactive');
    if (coupon.startsAt > new Date()) throw new Error('Coupon has not started yet');
    if (coupon.expiresAt < new Date()) throw new Error('Coupon has expired');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount is $${coupon.minOrderAmount}`);
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (cartTotal * Number(coupon.value)) / 100;
      if (coupon.maxDiscountAmount && discount > Number(coupon.maxDiscountAmount)) {
        discount = Number(coupon.maxDiscountAmount);
      }
    } else {
      discount = Number(coupon.value);
    }

    return {
      coupon,
      discount,
      finalTotal: cartTotal - discount,
    };
  }

  // Notifications
  async getUserNotifications(userId: string, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) where.isRead = false;

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markNotificationAsRead(userId: string, notificationId?: string) {
    if (notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    }

    return { success: true };
  }

  // User Profile
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            items: { take: 3, include: { product: { include: { images: { take: 1 } } } } },
          },
        },
        reviews: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      addresses: user.addresses,
      recentOrders: user.orders,
      reviews: user.reviews,
    };
  }

  async updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // Address Management
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async createAddress(userId: string, data: any) {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: { ...data, userId },
    });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new Error('Address not found');

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new Error('Address not found');

    await prisma.address.delete({ where: { id: addressId } });
    return { success: true };
  }

  // Order History for Customer
  async getOrderHistory(userId: string, page = 1, limit = 10) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: { include: { images: { take: 1 } } },
            },
          },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOrderDetails(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) throw new Error('Order not found');

    return order;
  }

  // Cancel Order (if allowed)
  async cancelOrder(userId: string, orderId: string, reason?: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) throw new Error('Order not found');
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new Error('Order cannot be cancelled at this stage');
    }

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        customerNotes: reason,
      },
    });
  }

  // Analytics tracking
  async trackEvent(data: {
    type: string;
    entityId?: string;
    userId?: string;
    sessionId?: string;
    metadata?: any;
  }) {
    return prisma.analytics.create({
      data,
    });
  }
}

export const customerService = new CustomerService();

// Controller functions
export class CustomerController {
  private service = new CustomerService();

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.getProducts(req.query as any);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.service.getProductBySlug(req.params.slug);
      res.json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.service.getCategories();
      res.json(categories);
    } catch (error: any) {
      next(error);
    }
  }

  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await this.service.getBrands();
      res.json(brands);
    } catch (error: any) {
      next(error);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await this.service.createReview(req.user!.id, req.body);
      res.status(201).json(review);
    } catch (error: any) {
      next(error);
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await this.service.getWishlist(req.user!.id);
      res.json(wishlist);
    } catch (error: any) {
      next(error);
    }
  }

  async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await this.service.addToWishlist(req.user!.id, req.body.productId);
      res.status(201).json(item);
    } catch (error: any) {
      next(error);
    }
  }

  async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.removeFromWishlist(req.user!.id, req.params.productId);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, cartTotal } = req.body;
      const result = await this.service.validateCoupon(code, req.user!.id, cartTotal);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const unreadOnly = req.query.unread === 'true';
      const notifications = await this.service.getUserNotifications(req.user!.id, unreadOnly);
      res.json(notifications);
    } catch (error: any) {
      next(error);
    }
  }

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.markNotificationAsRead(req.user!.id, req.params.id);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await this.service.getUserProfile(req.user!.id);
      res.json(profile);
    } catch (error: any) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.updateUserProfile(req.user!.id, req.body);
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  }

  async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await this.service.getAddresses(req.user!.id);
      res.json(addresses);
    } catch (error: any) {
      next(error);
    }
  }

  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await this.service.createAddress(req.user!.id, req.body);
      res.status(201).json(address);
    } catch (error: any) {
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await this.service.updateAddress(req.user!.id, req.params.id, req.body);
      res.json(address);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.deleteAddress(req.user!.id, req.params.id);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getOrderHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.getOrderHistory(
        req.user!.id,
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 10
      );
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.service.getOrderDetails(req.user!.id, req.params.id);
      res.json(order);
    } catch (error: any) {
      next(error);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.service.cancelOrder(req.user!.id, req.params.id, req.body.reason);
      res.json(order);
    } catch (error: any) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
