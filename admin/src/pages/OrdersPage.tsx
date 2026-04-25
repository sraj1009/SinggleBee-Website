import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Order, Pagination } from '../../types';
import { 
  Search, Eye, Truck, Package, CheckCircle, Clock, AlertCircle,
  Download, Filter, ShoppingBag, DollarSign
} from 'lucide-react';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, paymentFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders(page, limit, statusFilter || undefined, paymentFilter || undefined);
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadOrders();
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    }
  };

  const handleAddTracking = (order: Order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const handleSubmitTracking = async (trackingData: any) => {
    if (!selectedOrder) return;
    try {
      await api.addTrackingInfo(selectedOrder.id, trackingData);
      setShowTrackingModal(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (error) {
      console.error('Failed to add tracking:', error);
      alert('Failed to add tracking information');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const data = await api.exportOrders(format, {
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
      });
      
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'SHIPPED': return 'badge-info';
      case 'PROCESSING': return 'badge-warning';
      case 'CONFIRMED': return 'badge-info';
      case 'CANCELLED': return 'badge-danger';
      case 'REFUNDED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID': return 'badge-success';
      case 'AUTHORIZED': return 'badge-info';
      case 'FAILED': return 'badge-danger';
      case 'REFUNDED': return 'badge-warning';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button onClick={() => handleExport('json')} className="btn-secondary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by order number..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field w-full md:w-48"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            className="input-field w-full md:w-48"
          >
            <option value="">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPaymentBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {order.status === 'CONFIRMED' || order.status === 'PROCESSING' ? (
                          <button 
                            onClick={() => handleAddTracking(order)}
                            className="p-2 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Add Tracking"
                          >
                            <Truck className="w-4 h-4 text-amber-600" />
                          </button>
                        ) : order.status === 'SHIPPED' ? (
                          <span className="text-green-600" title="Shipped">
                            <CheckCircle className="w-5 h-5" />
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <TrackingModal
          order={selectedOrder}
          onClose={() => { setShowTrackingModal(false); setSelectedOrder(null); }}
          onSubmit={handleSubmitTracking}
        />
      )}
    </div>
  );
};

// Tracking Modal Component
const TrackingModal: React.FC<{
  order: Order;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}> = ({ order, onClose, onSubmit }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber || !carrier) {
      alert('Please fill in tracking number and carrier');
      return;
    }
    setLoading(true);
    await onSubmit({ trackingNumber, carrier, shippingMethod });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Tracking Information</h2>
          <p className="text-sm text-gray-600 mb-4">Order: {order.orderNumber}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number *</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="input-field"
                placeholder="e.g., 1Z999AA10123456784"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carrier *</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Carrier</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
                <option value="Amazon Logistics">Amazon Logistics</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
              <select
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="input-field"
              >
                <option value="">Select Method</option>
                <option value="Standard">Standard Shipping</option>
                <option value="Express">Express Shipping</option>
                <option value="Overnight">Overnight Shipping</option>
                <option value="International">International</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Save Tracking
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
