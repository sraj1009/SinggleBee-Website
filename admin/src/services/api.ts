import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('admin_token', response.data.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  getToken() {
    return localStorage.getItem('admin_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Dashboard
  async getDashboardStats() {
    const response = await this.client.get('/admin/dashboard');
    return response.data;
  }

  // Users
  async getUsers(page = 1, limit = 20, search?: string, role?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    const response = await this.client.get(`/admin/users?${params}`);
    return response.data;
  }

  async getUserById(id: string) {
    const response = await this.client.get(`/admin/users/${id}`);
    return response.data;
  }

  async createUser(userData: any) {
    const response = await this.client.post('/admin/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: any) {
    const response = await this.client.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.client.delete(`/admin/users/${id}`);
    return response.data;
  }

  // Products
  async getProducts(page = 1, limit = 20, status?: string, search?: string, category?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const response = await this.client.get(`/admin/products?${params}`);
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.client.get(`/admin/products/${id}`);
    return response.data;
  }

  async createProduct(productData: any) {
    const response = await this.client.post('/admin/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: any) {
    const response = await this.client.put(`/admin/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.client.delete(`/admin/products/${id}`);
    return response.data;
  }

  async updateProductStock(id: string, stock: number) {
    const response = await this.client.patch(`/admin/products/${id}/stock`, { stock });
    return response.data;
  }

  async bulkUpdateProducts(ids: string[], data: any) {
    const response = await this.client.post('/admin/products/bulk-update', { ids, data });
    return response.data;
  }

  // Orders
  async getOrders(page = 1, limit = 20, status?: string, paymentStatus?: string, userId?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    if (paymentStatus) params.append('paymentStatus', paymentStatus);
    if (userId) params.append('userId', userId);
    const response = await this.client.get(`/admin/orders?${params}`);
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.client.get(`/admin/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: string, statusData: any) {
    const response = await this.client.put(`/admin/orders/${id}/status`, statusData);
    return response.data;
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: string) {
    const response = await this.client.put(`/admin/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  }

  async addTrackingInfo(id: string, trackingData: any) {
    const response = await this.client.post(`/admin/orders/${id}/tracking`, trackingData);
    return response.data;
  }

  async getOrdersForShipment(status?: string) {
    const params = status ? `?status=${status}` : '';
    const response = await this.client.get(`/admin/orders/shipment/pending${params}`);
    return response.data;
  }

  // Analytics
  async getSalesAnalytics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await this.client.get(`/admin/analytics/sales?${params}`);
    return response.data;
  }

  async getShippingAnalytics() {
    const response = await this.client.get('/admin/analytics/shipping');
    return response.data;
  }

  // Export
  async exportOrders(format = 'csv', filters?: any) {
    const params = new URLSearchParams({ format });
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const response = await this.client.get(`/admin/reports/orders/export?${params}`, {
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
