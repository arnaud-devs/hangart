"use client";

import React, { useEffect, useState } from "react";
import { Eye, Filter, Download, Search, ChevronLeft, ChevronRight, DollarSign, CreditCard, Calendar, User, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

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
  buyer_name: string;
  amount: string;
  payment_method: string;
  status: "successful" | "failed" | "pending" | "cancelled";
  transaction_id: string;
  created_at: string;
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

      const response = await api.get("/payments/", { params });
      const data: PaymentsResponse = response.data;
      setPayments(data.results);
      setTotalCount(data.count);
    } catch (error: any) {
      showToast("error", "Error", error.response?.data?.message || error.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // Load payment details
  const loadPaymentDetails = async (paymentId: number) => {
    setLoadingDetails(true);
    try {
      const response = await api.get(`/payments/${paymentId}/`);
      setSelectedPayment(response.data);
      setShowDetails(true);
    } catch (error: any) {
      showToast("error", "Error", error.response?.data?.message || error.message || "Failed to load payment details");
    } finally {
      setLoadingDetails(false);
    }
  };

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
    (payment) =>
      payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleExport = () => {
    const csv = [
      ["Transaction ID", "Order #", "Buyer", "Amount", "Method", "Status", "Date"],
      ...payments.map((payment) => [
        payment.transaction_id,
        payment.order_number,
        payment.buyer_name,
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
    <div className="min-h-screen dark:bg-black p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Payments Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and verify all payment transactions</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg overflow-hidden">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5">
            <div className="p-4 rounded-lg bg-white dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-white/5">
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

            <div className="p-4 rounded-lg bg-white dark:bg-white/5">
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

            <div className="p-4 rounded-lg bg-white dark:bg-white/5">
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
          <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by transaction ID, order # or buyer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 dark:bg-white/5 bg-white  text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Methods</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="wallet">Wallet</option>
                    <option value="paypal">PayPal</option>
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Buyer
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
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{payment.transaction_id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900 dark:text-white">{payment.order_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{payment.buyer_name}</span>
                            </div>
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
                              onClick={() => loadPaymentDetails(payment.id)}
                              disabled={loadingDetails}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
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
          <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
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

        {/* Payment Details Modal */}
        {showDetails && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Transaction ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{selectedPayment.transaction_id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedPayment.status].badge}`}>
                      <span>{statusEmojis[selectedPayment.status]}</span>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Info */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Order Number</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedPayment.order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Order Status</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{selectedPayment.order.status}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Order Amount</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">${selectedPayment.order.total_amount}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Buyer</p>
                      <p className="text-gray-900 dark:text-white">
                        {selectedPayment.user.first_name} {selectedPayment.user.last_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPayment.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${selectedPayment.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                      <p className="text-gray-900 dark:text-white">
                        <span className="text-lg">{paymentMethodIcons[selectedPayment.payment_method] || "💳"}</span>
                        <span className="ml-2 capitalize">{selectedPayment.payment_method}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Gateway</p>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedPayment.provider_response.gateway}</p>
                    </div>
                  </div>
                </div>

                {/* Provider Response */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Gateway Response</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Charge ID</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">{selectedPayment.provider_response.charge_id}</p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Created At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedPayment.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">Updated At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedPayment.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Transaction Logs */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h3>
                  <div className="space-y-3">
                    {selectedPayment.logs && selectedPayment.logs.length > 0 ? (
                      selectedPayment.logs.map((log, index) => (
                        <div key={log.id} className="flex gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{log.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(log.timestamp).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">No transaction logs available</p>
                    )}
                  </div>
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
      </div>
    </div>
  );
}
