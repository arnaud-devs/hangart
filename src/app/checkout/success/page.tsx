"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const orderNum = searchParams.get("orderNumber");
    const id = searchParams.get("orderId");
    if (orderNum) setOrderNumber(orderNum);
    if (id) setOrderId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-lg p-8 text-center border border-black/5 dark:border-white/10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">Order Placed Successfully!</h1>
        
        {orderNumber && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Order Number</p>
            <p className="text-lg font-mono font-semibold text-blue-900 dark:text-blue-100">{orderNumber}</p>
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your order! Your order has been created and is pending payment. 
          You will receive a confirmation email shortly.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/gallery")}
            className="w-full px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact us at <a href="mailto:support@hangart.com" className="text-yellow-600 hover:text-yellow-700 underline">support@hangart.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
