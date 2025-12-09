"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Filter, Download, Search, ChevronLeft, ChevronRight, DollarSign, Package, Calendar, User, Edit, Loader } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { listOrders, updateOrderStatus } from "@/lib/appClient";
import { useAuth } from "@/lib/authProvider";

interface Order {
  id: number;
  buyer_name: string;
  order_number: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: string;
  created_at: string;
  items_count: number;
}

interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
  pending: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-200", badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" },
  paid: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-200", badge: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" },
  processing: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-200", badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" },
  shipped: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-200", badge: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" },
  delivered: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-200", badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-200", badge: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" },
};

const statusEmojis: Record<string, string> = {
  pending: "⏳",
  paid: "✅",
  processing: "🔄",
  shipped: "📦",
  delivered: "🎉",
  cancelled: "❌",
};

export default function OrdersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("-created_at");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Update status modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    status: "",
    tracking_number: "",
    admin_notes: "",
  });

  // Auth guard - redirect non-authenticated users
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Auth check disabled for development
    // Uncomment to re-enable authentication
    /*
    if (!authLoading && !user) {
      router.push("/login");
    }
    */
  }, [mounted, authLoading, user, router]);

  // Load orders using the documented API
  const loadOrders = async (pageNum = 1, status = "", payment = "", sort = "-created_at") => {
    setLoading(true);
    try {
      const params: any = {
        page: pageNum,
        ordering: sort,
      };
      if (status) params.status = status;
      if (payment) params.payment_method = payment;

      const response = await listOrders(params);
      
      // Handle both array and paginated responses
      let ordersData: Order[] = [];
      let count = 0;
      
      if (Array.isArray(response)) {
        ordersData = response.map(order => ({
          id: order.id,
          buyer_name: order.buyer?.username || 'Unknown',
          order_number: order.order_number,
          status: order.status as any,
          total_amount: order.total_amount?.toString() || '0',
          created_at: order.created_at || '',
          items_count: order.items?.length || 0,
        }));
        count = ordersData.length;
      } else {
        // Paginated response
        ordersData = (response.results || []).map((order: any) => ({
          id: order.id,
          buyer_name: order.buyer_name || order.buyer?.username || 'Unknown',
          order_number: order.order_number,
          status: order.status as any,
          total_amount: order.total_amount?.toString() || '0',
          created_at: order.created_at || '',
          items_count: order.items_count || order.items?.length || 0,
        }));
        count = response.count || 0;
      }
      
      setOrders(ordersData);
      setTotalCount(count);
    } catch (error: any) {
      showToast("error", "Error", error.response?.data?.message || error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load orders if mounted (auth check disabled for development)
    if (mounted) {
      loadOrders(page, statusFilter, paymentFilter, sortBy);
    }
  }, [page, statusFilter, paymentFilter, sortBy, mounted]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handlePaymentFilterChange = (payment: string) => {
    setPaymentFilter(payment);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  const filteredBySearch = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleExport = () => {
    const csv = [
      ["Order #", "Buyer", "Status", "Amount", "Items", "Date"],
      ...orders.map((order) => [
        order.order_number,
        order.buyer_name,
        order.status,
        order.total_amount,
        order.items_count,
        new Date(order.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("success", "Success", "Orders exported successfully");
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setUpdateFormData({
      status: order.status,
      tracking_number: "",
      admin_notes: "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setUpdateLoading(true);
    try {
      const payload: any = {
        status: updateFormData.status,
      };
      if (updateFormData.tracking_number) {
        payload.tracking_number = updateFormData.tracking_number;
      }
      if (updateFormData.admin_notes) {
        payload.admin_notes = updateFormData.admin_notes;
      }

      await updateOrderStatus(selectedOrder.id, payload);
      showToast("success", "Success", "Order status updated successfully");
      setShowUpdateModal(false);
      await loadOrders(page, statusFilter, paymentFilter, sortBy);
    } catch (error: any) {
      showToast("error", "Error", error.response?.data?.message || error.message || "Failed to update order status");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Orders Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage all customer orders</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">This Page</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredBySearch.length}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Page</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {page} / {totalPages || 1}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order # or buyer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Payment Method
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => handlePaymentFilterChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Methods</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="-total_amount">Highest Amount</option>
                    <option value="total_amount">Lowest Amount</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Buyer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBySearch.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No orders found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBySearch.map((order) => {
                      const colors = statusColors[order.status] || statusColors.pending;
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900 dark:text-white">{order.order_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{order.buyer_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                              <span>{statusEmojis[order.status]}</span>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">${order.total_amount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              <Package className="w-3 h-3" />
                              {order.items_count}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowDetails(true);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => openUpdateModal(order)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Update
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(page * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-semibold">{totalCount}</span> orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOrder.order_number}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Buyer</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 dark:text-white">{selectedOrder.buyer_name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${(statusColors[selectedOrder.status] || statusColors.pending).badge}`}>
                    <span>{statusEmojis[selectedOrder.status] || '❓'}</span>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${selectedOrder.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Items Count</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedOrder.items_count}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Order Date</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Update Order Status</h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOrder.order_number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                  <select
                    value={updateFormData.status}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tracking Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., DHL123456789"
                    value={updateFormData.tracking_number}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, tracking_number: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Notes (Optional)</label>
                  <textarea
                    placeholder="e.g., Shipped via DHL Express"
                    value={updateFormData.admin_notes}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, admin_notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updateLoading || !updateFormData.status}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {updateLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Update Status
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
