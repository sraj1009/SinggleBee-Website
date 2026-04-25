import { Router } from 'express';
import authService from '../services/auth.service.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema, 
  updateProfileSchema,
  changePasswordSchema 
} from '../validators/auth.validator.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const result = await authService.register(email, password, firstName, lastName, phone);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Email already registered') {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials' || error.message === 'Invalid credentials or account inactive') {
      res.status(401).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', validate(refreshTokenSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    await authService.logout(userId, token);
    
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    // Fetch full user profile
    const { prisma } = await import('../models/prisma.js');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/auth/profile
router.put('/profile', authenticate, validate(updateProfileSchema), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const updateData = req.body;
    
    const user = await authService.updateProfile(userId, updateData);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/change-password
router.post('/change-password', authenticate, validate(changePasswordSchema), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    
    await authService.changePassword(userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error: any) {
    if (error.message === 'Current password is incorrect' || error.message === 'User not found') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

export default router;
