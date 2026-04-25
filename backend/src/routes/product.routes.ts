import { Router } from 'express';
import productService from '../services/product.service.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { 
  createProductSchema, 
  updateProductSchema, 
  getProductSchema, 
  deleteProductSchema,
  listProductsSchema 
} from '../validators/product.validator.js';

const router = Router();

// GET /api/v1/products - Public (list active products)
router.get('/', validate(listProductsSchema), async (req, res, next) => {
  try {
    const filters = req.query;
    
    const result = await productService.getProducts({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      category: filters.category,
      brand: filters.brand,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      status: filters.status,
      featured: filters.featured,
      onSale: filters.onSale,
    });
    
    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/products/:id - Public
router.get('/:id', validate(getProductSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);
    
    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// POST /api/v1/products - Admin only
router.post('/', authenticate, authorize('ADMIN', 'VENDOR'), validate(createProductSchema), async (req: AuthRequest, res, next) => {
  try {
    const productData = req.body;
    
    const product = await productService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/products/:id - Admin only
router.put('/:id', authenticate, authorize('ADMIN', 'VENDOR'), validate(updateProductSchema), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await productService.updateProduct(id, updateData);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// DELETE /api/v1/products/:id - Admin only
router.delete('/:id', authenticate, authorize('ADMIN'), validate(deleteProductSchema), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    
    await productService.deleteProduct(id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

// POST /api/v1/products/:id/stock - Admin only
router.post('/:id/stock', authenticate, authorize('ADMIN', 'VENDOR'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'add' } = req.body;
    
    const product = await productService.updateStock(id, quantity, operation);
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error.message === 'Stock cannot be negative') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
});

export default router;
