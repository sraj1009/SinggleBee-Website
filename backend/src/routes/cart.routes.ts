import { Router } from 'express';
import { prisma } from '../models/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/v1/cart - Get user's cart
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      const newCart = await prisma.cart.create({
        data: {
          id: uuidv4(),
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      });
      
      res.json({ success: true, data: newCart });
      return;
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/cart/items - Add item to cart
router.post('/items', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity = 1, metadata } = req.body;
    
    // Get cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          id: uuidv4(),
          userId,
        },
        include: { items: true },
      });
    }
    
    // Get product
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          id: uuidv4(),
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
          metadata,
        },
      });
    }
    
    // Recalculate cart totals
    const updatedItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });
    
    const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const total = subtotal - Number(cart.discount);
    
    await prisma.cart.update({
      where: { id: cart.id },
      data: { subtotal, total },
    });
    
    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });
    
    res.json({
      success: true,
      message: 'Item added to cart',
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/cart/items/:itemId - Update cart item quantity
router.put('/items/:itemId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }
    
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    
    // Recalculate totals
    const updatedItems = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const total = subtotal - Number(cart.discount);
    
    await prisma.cart.update({
      where: { id: cart.id },
      data: { subtotal, total },
    });
    
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });
    
    res.json({
      success: true,
      message: 'Cart updated',
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/cart/items/:itemId - Remove item from cart
router.delete('/items/:itemId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }
    
    await prisma.cartItem.delete({ where: { id: itemId } });
    
    // Recalculate totals
    const updatedItems = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const total = subtotal - Number(cart.discount);
    
    await prisma.cart.update({
      where: { id: cart.id },
      data: { subtotal, total },
    });
    
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/cart/clear - Clear entire cart
router.delete('/clear', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }
    
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    
    await prisma.cart.update({
      where: { id: cart.id },
      data: { subtotal: 0, total: 0 },
    });
    
    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
