import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { DashboardStats, Order, Product } from '../../types';
import { 
  Users, Package, ShoppingCart, DollarSign, TrendingUp, 
  AlertTriangle, Clock, Truck, ArrowRight, Box
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.stats.totalUsers || 0, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Total Orders', value: stats?.stats.totalOrders || 0, icon: ShoppingCart, color: 'bg-green-500', change: '+8%' },
    { title: 'Total Products', value: stats?.stats.totalProducts || 0, icon: Package, color: 'bg-purple-500', change: '+5%' },
    { title: 'Total Revenue', value: `$${(stats?.stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-amber-500', change: '+15%' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.firstName || 'Admin'}!</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <a href="/orders" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders.length) && (
              <p className="text-center text-gray-500 py-4">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            <a href="/products" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-3">
            {stats?.lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{product.stock} left</p>
                  <span className="text-xs text-gray-500">Threshold: {product.lowStockThreshold}</span>
                </div>
              </div>
            ))}
            {(!stats?.lowStockProducts.length) && (
              <p className="text-center text-gray-500 py-4">All products well stocked!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/products/new" className="flex flex-col items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
            <Box className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </a>
          <a href="/orders" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Truck className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Orders</span>
          </a>
          <a href="/users" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Users</span>
          </a>
          <a href="/analytics" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
