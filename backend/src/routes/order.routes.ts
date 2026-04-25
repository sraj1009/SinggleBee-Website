import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../models/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' });

// Generate order number
const generateOrderNumber = async (): Promise<string> => {
  const date = new Date();
  const prefix = `ORD${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  
  const lastOrder = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: 'desc' },
  });
  
  if (lastOrder) {
    const lastNum = parseInt(lastOrder.orderNumber.slice(-6));
    return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
  }
  
  return `${prefix}000001`;
};

// POST /api/v1/orders - Create order
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { shippingAddressId, paymentMethod, customerNote } = req.body;
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty' });
      return;
    }
    
    // Get shipping address
    let shippingAddress;
    if (shippingAddressId) {
      shippingAddress = await prisma.address.findUnique({
        where: { id: shippingAddressId },
      });
    } else {
      shippingAddress = await prisma.address.findFirst({
        where: { userId, isDefault: true },
      });
    }
    
    if (!shippingAddress) {
      res.status(400).json({ success: false, message: 'Shipping address required' });
      return;
    }
    
    // Calculate totals
    const subtotal = Number(cart.subtotal);
    const shippingCost = 0; // TODO: Calculate based on shipping method
    const taxAmount = subtotal * 0.1; // TODO: Calculate based on location
    const discountAmount = Number(cart.discount);
    const total = subtotal + shippingCost + taxAmount - discountAmount;
    
    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity && !item.product.allowBackorder) {
        res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.product.name}` 
        });
        return;
      }
    }
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: { userId, cartId: cart.id },
    });
    
    // Create order
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderNumber: await generateOrderNumber(),
        userId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        fulfillmentStatus: 'UNFULFILLED',
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        total,
        currency: 'USD',
        paymentMethod,
        paymentIntentId: paymentIntent.id,
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        customerNote,
        items: {
          create: cart.items.map((item) => ({
            id: uuidv4(),
            productId: item.productId,
            name: item.product.name,
            sku: item.product.sku,
            price: item.price,
            quantity: item.quantity,
            total: Number(item.price) * item.quantity,
            image: item.product.images[0]?.url,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    
    // Update product stock
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          totalSales: { increment: item.quantity },
        },
      });
    }
    
    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({
      where: { id: cart.id },
      data: { subtotal: 0, total: 0 },
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    next(error);
  }
});

// GET /api/v1/orders - Get user's orders
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '10', status } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
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

// GET /api/v1/orders/:id - Get order details
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: true,
        payments: true,
        refunds: true,
      },
    });
    
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/orders/:id/confirm-payment - Confirm payment
router.post('/:id/confirm-payment', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { paymentIntentId } = req.body;
    
    const order = await prisma.order.findFirst({
      where: { id, userId },
    });
    
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      await prisma.order.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paidAt: new Date(),
          transactionId: paymentIntent.id,
        },
      });
      
      await prisma.payment.create({
        data: {
          id: uuidv4(),
          orderId: id,
          amount: order.total,
          currency: order.currency,
          method: 'card',
          provider: 'stripe',
          providerPaymentId: paymentIntent.id,
          status: 'PAID',
          processedAt: new Date(),
        },
      });
      
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/orders/:id/cancel - Cancel order
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    
    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      res.status(400).json({ success: false, message: 'Cannot cancel shipped order' });
      return;
    }
    
    await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });
    
    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    
    // Refund payment if already paid
    if (order.paymentStatus === 'PAID' && order.transactionId) {
      await stripe.refunds.create({ payment_intent: order.transactionId });
      await prisma.order.update({
        where: { id },
        data: { paymentStatus: 'REFUNDED' },
      });
    }
    
    res.json({ success: true, message: 'Order cancelled' });
  } catch (error) {
    next(error);
  }
});

export default router;
