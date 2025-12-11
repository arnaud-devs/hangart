"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader, ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, User, Calendar, FileText, Package } from "lucide-react";
import { appClient } from "@/lib/appClient";

const paymentMethodIcons: Record<string, string> = {
  card: "💳",
  bank: "🏦",
  wallet: "👛",
  paypal: "🅿️",
  mtnmomo: "📱",
  momo: "📱",
};

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  successful: { label: "Successful", icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/20" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/20" },
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
  cancelled: { label: "Cancelled", icon: AlertCircle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/20" },
};

export default function PaymentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params?.id;
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    setLoading(true);
    appClient.getPayment(Number(paymentId))
      .then(setPayment)
      .catch((err) => setError(err?.message || "Failed to load payment details"))
      .finally(() => setLoading(false));
  }, [paymentId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading payment details...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  if (!payment) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">No payment found.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Status badge
  const status = statusConfig[payment.status] || statusConfig["pending"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Payments</span>
        </button>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.color}`}> 
          <status.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Info */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Payment
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Transaction ID</span>
                <div className="font-mono text-base font-semibold text-gray-900 dark:text-white">{payment.transaction_id}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Amount</span>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${payment.amount}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Payment Method</span>
                <div className="text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-lg">{paymentMethodIcons?.[payment.payment_method] || "💳"}</span>
                  <span className="capitalize">{payment.payment_method}</span>
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Provider Response</span>
                <div className="text-gray-900 dark:text-white break-all text-xs">{payment.provider_response ? JSON.stringify(payment.provider_response) : '-'}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Created At</span>
                <div className="font-mono text-xs text-gray-700 dark:text-gray-300">{new Date(payment.created_at).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Updated At</span>
                <div className="font-mono text-xs text-gray-700 dark:text-gray-300">{new Date(payment.updated_at).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Info & Logs */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Order
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Order Number</span>
                <div className="font-semibold text-gray-900 dark:text-white">{payment.order?.order_number}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Buyer</span>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <User className="w-4 h-4 text-gray-400" />
                  {(payment.order as any)?.buyer_name ?? '-'}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Order Status</span>
                <div className="font-semibold text-gray-900 dark:text-white capitalize">{payment.order?.status}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Order Amount</span>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">${payment.order?.total_amount}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Order Created At</span>
                <div className="font-mono text-xs text-gray-700 dark:text-gray-300">{(payment.order as any)?.created_at ? new Date((payment.order as any).created_at).toLocaleString() : '-'}</div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">Products (Items Count)</span>
                <div className="font-semibold text-gray-900 dark:text-white">{(payment.order as any)?.items_count ?? '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Logs
            </h2>
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              {Array.isArray(payment.logs) && payment.logs.length > 0 ? payment.logs.map((log: any) => (
                <li key={log.id}>
                  <span className="font-mono">[{new Date(log.timestamp).toLocaleString()}]</span> {log.message}
                </li>
              )) : <li>-</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
