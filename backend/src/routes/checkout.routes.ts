import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const checkoutSchema = z.object({
  shippingAddressId: z.string(),
  billingAddressId: z.string().optional(),
  paymentMethod: z.enum(['CARD', 'PAYPAL', 'STRIPE', 'COD', 'BANK_TRANSFER']),
  customerNotes: z.string().optional(),
  couponCode: z.string().optional(),
});

const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  paymentMethodId: z.string(),
  orderId: z.string(),
});

// Mock Stripe service - replace with actual Stripe integration
class PaymentService {
  async createPaymentIntent(data: z.infer<typeof paymentIntentSchema>) {
    // In production, integrate with Stripe/PayPal
    return {
      clientSecret: `pi_${Date.now()}_secret_abc123`,
      paymentIntentId: `pi_${Date.now()}`,
      status: 'requires_payment_method',
    };
  }

  async confirmPayment(paymentIntentId: string) {
    // In production, confirm with Stripe
    return {
      status: 'succeeded',
      transactionId: `txn_${Date.now()}`,
    };
  }

  async processRefund(orderId: string, amount?: number) {
    // In production, process refund via Stripe
    return {
      success: true,
      refundId: `re_${Date.now()}`,
    };
  }
}

// Checkout controller
export class CheckoutController {
  private paymentService = new PaymentService();

  async initiateCheckout(req: any, res: any, next: any) {
    try {
      const userId = req.user!.id;
      const validation = checkoutSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const { shippingAddressId, billingAddressId, paymentMethod, customerNotes, couponCode } = validation.data;

      // Get user's cart
      const cart = await (globalThis as any).prisma.cart.findUnique({
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
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Validate stock availability
      for (const item of cart.items) {
        if (item.product.trackInventory) {
          const availableStock = item.product.variants.length > 0 && item.variantId
            ? item.product.variants.find(v => v.id === item.variantId)?.inventory || 0
            : 0;
          
          // If no variants, check product-level inventory (you may need to add this to schema)
          if (availableStock < item.quantity) {
            return res.status(400).json({
              error: `Insufficient stock for ${item.product.name}`,
              available: availableStock,
              requested: item.quantity,
            });
          }
        }
      }

      // Calculate totals
      const subtotal = cart.total;
      const tax = subtotal * 0.08; // 8% tax
      const shippingCost = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
      
      let discount = 0;
      if (couponCode) {
        // Validate coupon
        const coupon = await (globalThis as any).prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });

        if (coupon && coupon.isActive && coupon.startsAt <= new Date() && coupon.expiresAt >= new Date()) {
          if (coupon.type === 'PERCENTAGE') {
            discount = (Number(subtotal) * Number(coupon.value)) / 100;
            if (coupon.maxDiscountAmount && discount > Number(coupon.maxDiscountAmount)) {
              discount = Number(coupon.maxDiscountAmount);
            }
          } else {
            discount = Number(coupon.value);
          }
        }
      }

      const total = Number(subtotal) + Number(tax) + Number(shippingCost) - discount;

      // Create order
      const order = await (globalThis as any).prisma.order.create({
        data: {
          userId,
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod,
          subtotal,
          tax,
          shippingCost,
          discount,
          total,
          currency: 'USD',
          shippingAddressId,
          billingAddressId: billingAddressId || shippingAddressId,
          customerNotes,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
              total: Number(item.price) * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: { include: { images: { take: 1 } } },
            },
          },
          shippingAddress: true,
        },
      });

      // Update inventory
      for (const item of cart.items) {
        if (item.product.trackInventory && item.variantId) {
          await (globalThis as any).prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Clear cart
      await (globalThis as any).prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await (globalThis as any).prisma.cart.update({
        where: { id: cart.id },
        data: { total: 0, itemCount: 0 },
      });

      // Update coupon usage
      if (couponCode) {
        await (globalThis as any).prisma.coupon.update({
          where: { code: couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Create notification
      await (globalThis as any).prisma.notification.create({
        data: {
          userId,
          title: 'Order Placed Successfully',
          message: `Your order ${order.orderNumber} has been placed successfully!`,
          type: 'ORDER',
          link: `/orders/${order.id}`,
        },
      });

      // If COD, confirm order immediately
      if (paymentMethod === 'COD') {
        await (globalThis as any).prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PENDING', // Will be paid on delivery
          },
        });
      }

      res.status(201).json({
        order,
        requiresPayment: paymentMethod !== 'COD',
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createPaymentIntent(req: any, res: any, next: any) {
    try {
      const validation = paymentIntentSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const result = await this.paymentService.createPaymentIntent(validation.data);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async confirmPayment(req: any, res: any, next: any) {
    try {
      const { orderId, paymentIntentId } = req.body;

      const result = await this.paymentService.confirmPayment(paymentIntentId);

      // Update order
      await (globalThis as any).prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          transactionId: result.transactionId,
        },
      });

      res.json({ success: true, transactionId: result.transactionId });
    } catch (error: any) {
      next(error);
    }
  }

  async getShippingOptions(req: any, res: any, next: any) {
    try {
      const { addressId, cartTotal } = req.query;
      
      // Get address to determine shipping zone
      const address = await (globalThis as any).prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!address) {
        return res.status(400).json({ error: 'Invalid address' });
      }

      // Calculate shipping options based on location and cart value
      const options = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          cost: Number(cartTotal) > 100 ? 0 : 9.99,
          estimatedDays: '5-7 business days',
        },
        {
          id: 'express',
          name: 'Express Shipping',
          cost: 19.99,
          estimatedDays: '2-3 business days',
        },
        {
          id: 'overnight',
          name: 'Overnight Shipping',
          cost: 39.99,
          estimatedDays: '1 business day',
        },
      ];

      res.json({ options });
    } catch (error: any) {
      next(error);
    }
  }

  async processRefund(req: any, res: any, next: any) {
    try {
      const userId = req.user!.id;
      const { orderId, reason } = req.body;

      const order = await (globalThis as any).prisma.order.findFirst({
        where: { id: orderId, userId },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.paymentStatus !== 'PAID') {
        return res.status(400).json({ error: 'Order not paid' });
      }

      if (!['DELIVERED', 'CANCELLED'].includes(order.status)) {
        return res.status(400).json({ error: 'Order not eligible for refund' });
      }

      const result = await this.paymentService.processRefund(orderId);

      await (globalThis as any).prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'REFUNDED',
          status: 'REFUNDED',
          notes: reason,
        },
      });

      res.json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  }
}

export const checkoutController = new CheckoutController();

// Routes
router.post('/initiate', (req, res, next) => checkoutController.initiateCheckout(req, res, next));
router.post('/payment-intent', (req, res, next) => checkoutController.createPaymentIntent(req, res, next));
router.post('/confirm-payment', (req, res, next) => checkoutController.confirmPayment(req, res, next));
router.get('/shipping-options', (req, res, next) => checkoutController.getShippingOptions(req, res, next));
router.post('/refund', (req, res, next) => checkoutController.processRefund(req, res, next));

export default router;
