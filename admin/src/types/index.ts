export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR' | 'SUPPORT';
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  orders?: Order[];
  _count?: { orders: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  visibility: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
  averageRating: number;
  reviewCount: number;
  totalSales: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  brandId: string | null;
  brand?: Brand;
  categories: Category[];
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number | null;
  stock: number;
  options: Record<string, string>;
  image: string | null;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  image: string | null;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  paymentMethod: string | null;
  shippingAddress: Record<string, any>;
  billingAddress: Record<string, any> | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  customerNote: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED';

export type FulfillmentStatus = 
  | 'UNFULFILLED' 
  | 'PARTIALLY_FULFILLED' 
  | 'FULFILLED' 
  | 'RETURNED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string | null;
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  provider: string;
  status: PaymentStatus;
  processedAt: string | null;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
  };
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  users?: User[];
  products?: Product[];
  orders?: Order[];
  pagination?: Pagination;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
