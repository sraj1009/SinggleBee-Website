import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    comparePrice: z.number().positive().optional(),
    cost: z.number().positive().optional(),
    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    price: z.number().positive().optional(),
    comparePrice: z.number().positive().optional(),
    cost: z.number().positive().optional(),
    sku: z.string().min(1).optional(),
    barcode: z.string().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'HIDDEN']).optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isOnSale: z.boolean().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'popular']).default('newest'),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).optional(),
    featured: z.string().transform((v) => v === 'true').optional(),
    onSale: z.string().transform((v) => v === 'true').optional(),
  }),
});
