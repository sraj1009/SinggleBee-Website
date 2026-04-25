import { Request, Response } from 'express';
import { prisma } from '../models/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export class ProductService {
  async createProduct(data: any) {
    const { categories, images, tags, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categories: categories ? { connect: categories.map((id: string) => ({ id })) } : undefined,
        images: images ? {
          create: images.map((url: string, index: number) => ({
            url,
            position: index,
            isPrimary: index === 0,
          }))
        } : undefined,
        tags: tags ? { connect: tags.map((slug: string) => ({ slug })) } : undefined,
      },
      include: {
        categories: true,
        brand: true,
        images: true,
        tags: true,
      },
    });

    return product;
  }

  async getProducts(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    status?: string;
    featured?: boolean;
    onSale?: boolean;
  }) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      sort = 'newest',
      status,
      featured,
      onSale,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categories = { some: { slug: category } };
    }

    if (brand) {
      where.brandId = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (status) {
      where.status = status;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    if (onSale !== undefined) {
      where.isOnSale = onSale;
    }

    const orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'name_asc':
        orderBy.name = 'asc';
        break;
      case 'name_desc':
        orderBy.name = 'desc';
        break;
      case 'popular':
        orderBy.totalSales = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          categories: true,
          brand: true,
          images: { where: { isPrimary: true }, take: 1 },
          tags: true,
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
        images: { orderBy: { position: 'asc' } },
        variants: true,
        options: true,
        tags: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, data: any) {
    const { categories, images, tags, ...productData } = data;

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Product not found');
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categories: categories ? { set: categories.map((catId: string) => ({ id: catId })) } : undefined,
        tags: tags ? { set: tags.map((slug: string) => ({ slug })) } : undefined,
      },
      include: {
        categories: true,
        brand: true,
        images: true,
        tags: true,
      },
    });

    return product;
  }

  async deleteProduct(id: string) {
    await prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(productId: string, quantity: number, operation: 'add' | 'subtract' | 'set') {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    
    if (!product) {
      throw new Error('Product not found');
    }

    let newStock: number;
    switch (operation) {
      case 'add':
        newStock = product.stock + quantity;
        break;
      case 'subtract':
        newStock = product.stock - quantity;
        break;
      case 'set':
        newStock = quantity;
        break;
    }

    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return prisma.product.update({
      where: { id: productId },
      data: { 
        stock: newStock,
        status: newStock === 0 && !product.allowBackorder ? 'OUT_OF_STOCK' : product.status,
      },
    });
  }
}

export default new ProductService();
