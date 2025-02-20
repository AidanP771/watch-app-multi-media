import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Filter, Download, ArrowUpDown, Truck, Package, AlertCircle, RefreshCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_id: number;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  tracking_number: string | null;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: {
    last_four: string;
    card_type: string;
  };
  items: OrderItem[];
}

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'order'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_address:addresses!shipping_address_id(*),
          payment_method:payment_methods(*),
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      // Add items to cart
      order.items.forEach(item => {
        // Add to cart logic here
      });
      navigate('/cart');
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      // Generate and download invoice logic here
      console.log('Downloading invoice for order:', orderId);
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  };

  const handleTrackOrder = (trackingNumber: string) => {
    // Open tracking page in new tab
    window.open(`https://tracking.carrier.com/${trackingNumber}`, '_blank');
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      fetchOrders();
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        // In a real app, you would look up the product name from your products table
        `Product ${item.product_id}`.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const matchesDate = 
      (!dateRange.start || new Date(order.created_at) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(order.created_at) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'date':
        return multiplier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'amount':
        return multiplier * (a.total_amount - b.total_amount);
      case 'order':
        return multiplier * a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="flex-1 px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="flex-1 px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'order')}
            className="flex-1 px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="order">Sort by Order #</option>
          </select>
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-primary text-white border border-gray-dark rounded hover:border-secondary transition"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-light">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p>No orders found</p>
          </div>
        ) : (
          sortedOrders.map(order => (
            <div key={order.id} className="bg-primary rounded-lg p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-gray-light">Order #{order.id}</p>
                  <p className="text-white text-lg">
                    {format(new Date(order.created_at), 'PPP')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-light">Total Amount</p>
                  <p className="text-secondary text-lg">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                  order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                {order.tracking_number && (
                  <button
                    onClick={() => handleTrackOrder(order.tracking_number!)}
                    className="flex items-center gap-1 text-sm text-secondary hover:text-secondary-light transition"
                  >
                    <Truck className="w-4 h-4" />
                    Track Package
                  </button>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Items</h4>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-light">
                      <span>Product {item.product_id} × {item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-white font-semibold mb-2">Shipping Address</h4>
                <p className="text-gray-light">
                  {order.shipping_address.name}<br />
                  {order.shipping_address.street}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                  {order.shipping_address.country}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-white font-semibold mb-2">Payment Method</h4>
                <p className="text-gray-light">
                  {order.payment_method.card_type} ending in {order.payment_method.last_four}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-dark">
                <button
                  onClick={() => handleReorder(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-light text-primary rounded transition"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reorder
                </button>
                <button
                  onClick={() => handleDownloadInvoice(order.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-dark hover:border-secondary text-white rounded transition"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 rounded transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;