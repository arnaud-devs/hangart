"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listMyOrders, getOrder } from '@/lib/appClient';
import { 
  Package, 
  X, 
  ChevronDown,
  CheckCircle,
  Clock,
  ShoppingBag,
  HelpCircle,
  DollarSign,
  Calendar,
  Hash,
  RefreshCw,
  AlertCircle,
  Download,
  Eye,
  CreditCard,
  Search,
  Truck,
  RefreshCcw,
} from 'lucide-react';

interface OrderItem {
  id: number;
  artwork: {
    id: number;
    title: string;
    artist_name: string;
    price: string;
    main_image: string;
  };
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  buyer: {
    id: number;
    username: string;
    email?: string | null;
  };
  items: OrderItem[];
  subtotal: string;
  shipping_fee: string;
  total_amount: string;
  status: string;
  payment_method?: string;
  payment_reference?: string;
  shipping_address: string;
  tracking_number?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending_payment: {
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: 'Pending Payment'
    },
    confirmed: {
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: 'Confirmed'
    },
    processing: {
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: <RefreshCw className="w-3 h-3 mr-1" />,
      label: 'Processing'
    },
    shipped: {
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: <Truck className="w-3 h-3 mr-1" />,
      label: 'Shipped'
    },
    delivered: {
      color: 'bg-green-50 text-green-800 border-green-200',
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: 'Delivered'
    },
    paid: {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: 'Paid'
    },
    cancelled: {
      color: 'bg-red-50 text-red-800 border-red-200',
      icon: <X className="w-3 h-3 mr-1" />,
      label: 'Cancelled'
    },
    refunded:{
      color: 'bg-red-50 text-red-800 border-red-200',
      icon: <RefreshCcw className="w-3 h-3 mr-1" />,
      label: 'Refunded'
    }
  };

  const config = statusConfig[status.toLowerCase()] || {
    color: 'bg-gray-50 text-gray-800 border-gray-200',
    icon: <Package className="w-3 h-3 mr-1" />,
    label: status
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    setMounted(true);

    const checkAuthAndLoadOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push(`/login?redirect=/orders`);
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const userRole = (userData.role || '').toString().toLowerCase();
          if (userRole !== 'buyer') {
            router.push('/');
            return;
          }
          setUser(userData);
        }

        const ordersData = await listMyOrders();
        const ordersList = Array.isArray(ordersData) ? ordersData : ordersData.results || [];
        setOrders(ordersList as Order[]);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadOrders();
  }, [mounted, router]);

  const statusLabels: Record<string, string> = {
    all: 'All Orders',
    pending_payment: 'Pending Payment',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    paid: 'Paid',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach(order => {
      const status = order.status.toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    let filteredOrders = orders;
    const q = query.trim().toLowerCase();

    if (q) {
      filteredOrders = filteredOrders.filter(order =>
        order.order_number.toLowerCase().includes(q) ||
        order.id.toString().includes(q) ||
        order.items.some(item =>
          item.artwork.title.toLowerCase().includes(q)
        )
      );
    }

    if (statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filteredOrders;
  }, [orders, query, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Order History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your orders
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders..."
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setLoading(true);
                listMyOrders().then(data => {
                  const ordersList = Array.isArray(data) ? data : data.results || [];
                  setOrders(ordersList as Order[]);
                  setLoading(false);
                });
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pending_payment', 'confirmed', 'processing', 'shipped', 'paid', 'delivered', 'cancelled','refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">
                  {status === 'pending_payment' ? <Clock className="w-4 h-4" /> :
                   status === 'confirmed' ? <CheckCircle className="w-4 h-4" /> :
                   status === 'processing' ? <RefreshCw className="w-4 h-4" /> :
                   status === 'shipped' ? <Truck className="w-4 h-4" /> :
                   status === 'paid' ? <CheckCircle className="w-4 h-4" /> :
                   status === 'delivered' ? <CheckCircle className="w-4 h-4" /> :
                   status === 'cancelled' ? <X className="w-4 h-4" /> :
                   status === 'refunded' ? <RefreshCcw className="w-4 h-4" /> :
                   <Package className="w-4 h-4" />}
                </span>
                {statusLabels[status as keyof typeof statusLabels]}
                <span className="ml-1.5 bg-gray-200 dark:bg-white/5 dark:border-white/20 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs">
                  {statusCounts[status as keyof typeof statusCounts] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filtered.length} orders found
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map((order: Order) => (
            <div key={order.id} className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Order {order.order_number}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                    <button
                      onClick={() => setOpenId(openId === order.id.toString() ? null : order.id.toString())}
                      className="flex items-center px-3 py-1.5 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                    >
                      {openId === order.id.toString() ? 'Hide' : 'View'}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${openId === order.id.toString() ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {order.items.length} items
                      </span>
                    </div>
                    <div className="text-gray-300 dark:text-gray-600">•</div>
                    <div className="text-gray-600 dark:text-gray-400 truncate max-w-xs">
                      {order.items.map(item => item.artwork.title).join(', ')}
                    </div>
                  </div>
                  {order.tracking_number && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">Tracking: {order.tracking_number}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {openId === order.id.toString() && (
                <div className="bg-white dark:bg-white/5 border-t-4 border-yellow-600">
                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Order Items */}
                      <div className="xl:col-span-2">
                        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <Package className="w-5 h-5 text-yellow-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Order Items</h3>
                          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                            {order.items.length} items
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  <img
                                    src={item.artwork.main_image || '/placeholder-art.png'}
                                    alt={item.artwork.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-base mb-1">
                                    {item.artwork.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>Qty: {item.quantity}</span>
                                    <span>•</span>
                                    <span>${parseFloat(item.price).toFixed(2)} each</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Information & Actions */}
                      <div className="space-y-6">
                        {/* Order Details Card */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-5">
                          <div className="flex items-center space-x-2 mb-4">
                            <Hash className="w-5 h-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Order Details</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Order Number</span>
                              <span className="font-mono text-gray-900 dark:text-gray-100">{order.order_number}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Order Date</span>
                              <span className="text-gray-900 dark:text-gray-100">{formatDate(order.created_at)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
                              <span className="text-gray-900 dark:text-gray-100">${parseFloat(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Shipping</span>
                              <span className="text-gray-900 dark:text-gray-100">${parseFloat(order.shipping_fee).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Total Amount</span>
                              <span className="font-bold text-lg text-yellow-600">${parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Status</span>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-5">
                          <div className="flex items-center space-x-2 mb-4">
                            <Truck className="w-5 h-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shipping Address</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{order.shipping_address}</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-5">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                          <div className="space-y-2">
                            {order.status.toLowerCase() === 'pending_payment' && (
                              <button
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                                onClick={() => router.push(`/payments/${order.id}`)}
                              >
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
                <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Orders Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {query || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'You haven\'t placed any orders yet. Start shopping now!'}
                </p>
                {(query || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                )}
                {!query && statusFilter === 'all' && (
                  <button
                    onClick={() => window.location.href = '/gallery'}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Start Shopping
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
