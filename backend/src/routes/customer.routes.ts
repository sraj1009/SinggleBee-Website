import { Router } from 'express';
import { customerController } from '../services/customer.service';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes - Product browsing
router.get('/products', customerController.getProducts.bind(customerController));
router.get('/products/:slug', customerController.getProduct.bind(customerController));
router.get('/categories', customerController.getCategories.bind(customerController));
router.get('/brands', customerController.getBrands.bind(customerController));

// Protected routes - require authentication
router.use(authenticate);

// Reviews
router.post('/reviews', customerController.createReview.bind(customerController));

// Wishlist
router.get('/wishlist', customerController.getWishlist.bind(customerController));
router.post('/wishlist', customerController.addToWishlist.bind(customerController));
router.delete('/wishlist/:productId', customerController.removeFromWishlist.bind(customerController));

// Coupons
router.post('/coupons/validate', customerController.validateCoupon.bind(customerController));

// Notifications
router.get('/notifications', customerController.getNotifications.bind(customerController));
router.patch('/notifications/:id/read', customerController.markNotificationRead.bind(customerController));
router.patch('/notifications/read-all', customerController.markNotificationRead.bind(customerController));

// User Profile
router.get('/profile', customerController.getProfile.bind(customerController));
router.put('/profile', customerController.updateProfile.bind(customerController));

// Addresses
router.get('/addresses', customerController.getAddresses.bind(customerController));
router.post('/addresses', customerController.createAddress.bind(customerController));
router.put('/addresses/:id', customerController.updateAddress.bind(customerController));
router.delete('/addresses/:id', customerController.deleteAddress.bind(customerController));

// Orders
router.get('/orders', customerController.getOrderHistory.bind(customerController));
router.get('/orders/:id', customerController.getOrderDetails.bind(customerController));
router.post('/orders/:id/cancel', customerController.cancelOrder.bind(customerController));

export default router;
