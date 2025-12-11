"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Filter, Download, Search, ChevronLeft, ChevronRight, DollarSign, CreditCard, Calendar, User, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { appClient } from "@/lib/appClient";
type APIOrder = {
  id: number;
  order_number: string;
  buyer_name: string;
  items_count: number;
};

interface PaymentLog {
  id: number;
  message: string;
  timestamp: string;
}

interface PaymentData {
  id: number;
  order: {
    id: number;
    order_number: string;
    status: string;
    total_amount: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  payment_method: string;
  amount: string;
  transaction_id: string;
  provider_response: {
    gateway: string;
    charge_id: string;
  };
  status: "successful" | "failed" | "pending" | "cancelled";
  created_at: string;
  updated_at: string;
  logs: PaymentLog[];
}

interface Payment {
  id: number;
  order_number: string;
  amount: string;
  payment_method: string;
  status: "successful" | "failed" | "pending" | "cancelled";
  transaction_id: string;
  created_at: string;
  order?: {
    buyer_name?: string;
    items_count?: number;
  };
}

interface PaymentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

const statusColors: Record<string, { bg: string; text: string; badge: string; icon: any }> = {
  successful: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-200", badge: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200", icon: CheckCircle },
  failed: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-200", badge: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200", icon: AlertCircle },
  pending: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-200", badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200", icon: Clock },
  cancelled: { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-700 dark:text-gray-200", badge: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200", icon: AlertCircle },
};

const statusEmojis: Record<string, string> = {
  successful: "✅",
  failed: "❌",
  pending: "⏳",
  cancelled: "🚫",
};

const paymentMethodIcons: Record<string, string> = {
  card: "💳",
  bank: "🏦",
  wallet: "👛",
  paypal: "🅿️",
};

export default function PaymentsPage() {
  const { showToast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("-created_at");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  // Polling state
  const [polling, setPolling] = useState(false);
  const [pollingError, setPollingError] = useState<string | null>(null);

  // Load payments list
  const loadPayments = async (pageNum = 1, status = "", method = "", sort = "-created_at") => {
    setLoading(true);
    try {
      const params: any = {
        page: pageNum,
        ordering: sort,
      };
      if (status) params.status = status;
      if (method) params.payment_method = method;

      // Fetch payments
      const data: PaymentsResponse = await appClient.listPayments(params);
      // Fetch all orders (for current page)
      const orderNumbers = data.results.map((p) => p.order_number).filter(Boolean);
      let orders: APIOrder[] = [];
      if (orderNumbers.length > 0) {
        // Fetch all orders (paginated)
        const allOrdersResp = await appClient.listOrders();
        let allOrders: APIOrder[] = [];
        if (Array.isArray(allOrdersResp)) {
          allOrders = allOrdersResp as unknown as APIOrder[];
        } else if (allOrdersResp && Array.isArray(allOrdersResp.results)) {
          allOrders = allOrdersResp.results as unknown as APIOrder[];
        }
        orders = allOrders.filter((o: APIOrder) => orderNumbers.includes(o.order_number));
      }
      // Attach buyer_name and items_count from order to each payment
      const paymentsWithOrder = data.results.map((p) => {
        const order = orders.find((o) => o.order_number === p.order_number);
        return {
          ...p,
          order: {
            buyer_name: order ? order.buyer_name : '-',
            items_count: order ? order.items_count : 0,
          },
        };
      });
      setPayments(paymentsWithOrder);
      setTotalCount(data.count);
    } catch (error: any) {
      showToast("error", "Error", error.response?.data?.message || error.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // Load payment details
  const router = useRouter();
  const goToPaymentDetails = (paymentId: number) => {
    router.push(`/dashboard/payments/${paymentId}`);
  };

  // Poll payment status every 10 seconds if pending
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (showDetails && selectedPayment && selectedPayment.status === 'pending' && polling) {
      interval = setInterval(async () => {
        try {
          const resp = await appClient.checkPaymentStatus(String(selectedPayment.id));
          if (resp && resp.payment) {
            setSelectedPayment((prev) => prev ? {
              ...prev,
              status: resp.payment.status,
              transaction_id: resp.payment.transaction_id || prev.transaction_id,
              amount: resp.payment.amount || prev.amount,
              provider_response: resp.payment.provider_response || prev.provider_response,
            } : prev);
            if (resp.payment.status !== 'pending') {
              setPolling(false);
            }
          }
        } catch (err: any) {
          setPollingError(err?.message || 'Polling failed');
        }
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showDetails, selectedPayment, polling]);

  useEffect(() => {
    loadPayments(page, statusFilter, methodFilter, sortBy);
  }, [page, statusFilter, methodFilter, sortBy]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleMethodFilterChange = (method: string) => {
    setMethodFilter(method);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  const filteredBySearch = payments.filter(
    (payment) => {
      if (!payment) return false;
      const tx = typeof payment.transaction_id === 'string' ? payment.transaction_id : '';
      const buyer = typeof payment.order?.buyer_name === 'string' ? payment.order.buyer_name : '';
      const orderNum = typeof payment.order_number === 'string' ? payment.order_number : '';
      const search = searchTerm.toLowerCase();
      return (
        tx.toLowerCase().includes(search) ||
        buyer.toLowerCase().includes(search) ||
        orderNum.toLowerCase().includes(search)
      );
    }
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleExport = () => {
    const csv = [
      ["Transaction ID", "Order #", "Buyer", "Amount", "Method", "Status", "Date"],
      ...payments.map((payment) => [
        payment.transaction_id,
        payment.order_number,
        payment.order?.buyer_name,
        payment.amount,
        payment.payment_method,
        payment.status,
        new Date(payment.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("success", "Success", "Payments exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Payments Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and verify all payment transactions</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Successful</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {payments.filter((p) => p.status === "successful").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {payments.filter((p) => p.status === "failed").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
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
                  placeholder="Search by transaction ID, order # or buyer name..."
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
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Payment Method
                  </label>
                  <select
                    value={methodFilter}
                    onChange={(e) => handleMethodFilterChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Methods</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="wallet">Wallet</option>
                    <option value="paypal">PayPal</option>
                    <option value="momo">MoMo</option>
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
                    <option value="-amount">Highest Amount</option>
                    <option value="amount">Lowest Amount</option>
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
                <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
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
                      Products Sold
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Status
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
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <CreditCard className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No payments found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBySearch.map((payment) => {
                      const colors = statusColors[payment.status];
                      const StatusIcon = colors.icon;
                      return (
                        <tr
                          key={payment.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          {/* Transaction ID column removed */}
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900 dark:text-white">{payment.order_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{payment.order?.buyer_name || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {/* Products Sold: show items_count from order */}
                            {typeof payment.order?.items_count === 'number' ? payment.order.items_count : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">${payment.amount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg">{paymentMethodIcons[payment.payment_method] || "💳"}</span>
                            <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">{payment.payment_method}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                              <StatusIcon className="w-4 h-4" />
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payment.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => goToPaymentDetails(payment.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
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
              of <span className="font-semibold">{totalCount}</span> payments
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

        {/* Payment details modal removed. Now handled by /dashboard/payments/[id] page. */}
      </div>
    </div>
  );
}
