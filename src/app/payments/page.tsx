
"use client";

import React from 'react';
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listMyPayments } from "@/lib/appClient";
import { RefreshCw, Search, X, ChevronDown, CheckCircle, Clock, CreditCard, DollarSign, Download, Eye, Package } from "lucide-react";

interface Payment {
  id: number;
  order: {
    id: number;
    order_number: string;
    status: string;
    total_amount: string | number;
  };
  payment_method: string;
  amount: string | number;
  transaction_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: {
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: "Pending"
    },
    successful: {
      color: "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: "Successful"
    },
    failed: {
      color: "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
      icon: <X className="w-3 h-3 mr-1" />,
      label: "Failed"
    },
    cancelled: {
      color: "bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10",
      icon: <Package className="w-3 h-3 mr-1" />,
      label: "Cancelled"
    },
    refunded: {
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      icon: <RefreshCw className="w-3 h-3 mr-1" />,
      label: "Refunded"
    },
  };
  const config = statusConfig[status.toLowerCase()] || {
    color: "bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10",
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    listMyPayments().then((data) => {
      const list = Array.isArray(data) ? data : data.results || [];
      setPayments(list as Payment[]);
      setLoading(false);
    });
  }, []);

  const statusLabels: Record<string, string> = {
    all: "All Payments",
    pending: "Pending",
    successful: "Successful",
    failed: "Failed",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: payments.length };
    payments.forEach((p) => {
      const status = p.status.toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [payments]);

  const filtered = useMemo(() => {
    let filteredPayments = payments;
    const q = query.trim().toLowerCase();
    if (q) {
      filteredPayments = filteredPayments.filter((p) =>
        p.order.order_number.toLowerCase().includes(q) ||
        p.transaction_id.toLowerCase().includes(q) ||
        p.payment_method.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      filteredPayments = filteredPayments.filter((p) =>
        p.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    return filteredPayments;
  }, [payments, query, statusFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] dark:bg-black py-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-white/5 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-white/10">
          <RefreshCw className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-black py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your payments
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
                placeholder="Search payments..."
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setLoading(true);
                listMyPayments().then((data) => {
                  const list = Array.isArray(data) ? data : data.results || [];
                  setPayments(list as Payment[]);
                  setLoading(false);
                });
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "successful", "failed", "cancelled", "refunded"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-yellow-600 text-white"
                    : "bg-white dark:bg-black text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <span className="mr-2">
                  {status === "pending" ? <Clock className="w-4 h-4" /> :
                   status === "successful" ? <CheckCircle className="w-4 h-4" /> :
                   status === "failed" ? <X className="w-4 h-4" /> :
                   status === "cancelled" ? <Package className="w-4 h-4" /> :
                   status === "refunded" ? <RefreshCw className="w-4 h-4" /> :
                   <DollarSign className="w-4 h-4" />}
                </span>
                {statusLabels[status as keyof typeof statusLabels]}
                <span className="ml-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs">
                  {statusCounts[status as keyof typeof statusCounts] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payments Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filtered.length} payments found
          </p>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filtered.map((payment) => (
            <div key={payment.id} className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-md transition-shadow">
              {/* Payment Header */}
              <div className="p-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        Payment {payment.order.order_number}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Made on {formatDate(payment.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        ${parseFloat(payment.amount as string).toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.payment_method.toUpperCase()}
                      </p>
                    </div>
                    <StatusBadge status={payment.status} />
                    <button
                      onClick={() => setOpenId(openId === payment.id ? null : payment.id)}
                      className="flex items-center px-3 py-1.5 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                    >
                      {openId === payment.id ? "Hide" : "View"}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${openId === payment.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {payment.payment_method.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-300 dark:text-gray-600">•</div>
                    <div className="text-gray-600 dark:text-gray-400 truncate max-w-xs">
                      Transaction: {payment.transaction_id}
                    </div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Order: {payment.order.order_number}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {openId === payment.id && (
                <div className="bg-white dark:bg-black border-t-4 border-yellow-600">
                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Payment Details */}
                      <div>
                        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200 dark:border-white/10">
                          <CreditCard className="w-5 h-5 text-yellow-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Order Number</span>
                            <span className="font-mono text-gray-900 dark:text-white">{payment.order.order_number}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Transaction ID</span>
                            <span className="font-mono text-gray-900 dark:text-white">{payment.transaction_id}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Amount</span>
                            <span className="text-gray-900 dark:text-white">${parseFloat(payment.amount as string).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Status</span>
                            <StatusBadge status={payment.status} />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Payment Method</span>
                            <span className="text-gray-900 dark:text-white">{payment.payment_method.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200 dark:border-white/10">
                          <Package className="w-5 h-5 text-yellow-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Info</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Order Number</span>
                            <span className="font-mono text-gray-900 dark:text-white">{payment.order.order_number}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Order Status</span>
                            <span className="text-gray-900 dark:text-white">{payment.order.status}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Order Total</span>
                            <span className="text-gray-900 dark:text-white">${parseFloat(payment.order.total_amount as string).toFixed(2)}</span>
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
              <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-8 max-w-md mx-auto">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Payments Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {query || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "You haven't made any payments yet."
                  }
                </p>
                {(query || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("all");
                    }}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                )}
                {!query && statusFilter === "all" && (
                  <button
                    onClick={() => router.push("/orders")}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Go to Orders
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
