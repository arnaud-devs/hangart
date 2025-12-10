"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { initiatePayment } from "@/lib/payments";
import { getMe } from "@/lib/authClient";

export default function PaymentSelectionPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState<string>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function guard() {
      try {
        await getMe();
      } catch {
        router.push("/login?redirect=/checkout/payment");
        return;
      } finally {
        setCheckingAuth(false);
      }
    }
    guard();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication…</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = 10.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      // You can pass the chosen method to backend via the stub if needed
      const result = await initiatePayment(items);
      console.log("Payment method:", method, "result:", result);
      clearCart();
      router.push("/checkout/success");
    } catch (e: any) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Choose Payment Method</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow p-6 border border-black/5 dark:border-white/10">
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment-method"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />
                <div>
                  <div className="font-semibold">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Visa, MasterCard</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment-method"
                  checked={method === "paypal"}
                  onChange={() => setMethod("paypal")}
                />
                <div>
                  <div className="font-semibold">PayPal</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pay with PayPal account</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment-method"
                  checked={method === "mobile"}
                  onChange={() => setMethod("mobile")}
                />
                <div>
                  <div className="font-semibold">Mobile Money</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">MTN, Airtel, etc.</div>
                </div>
              </label>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/checkout")}
                  className="px-6 py-3 rounded-md border"
                >
                  Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Processing…" : "Pay Now"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow p-6 h-fit border border-black/5 dark:border-white/10">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={String(item.id)} className="flex gap-4">
                  <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={item.image ? (item.image.startsWith("/") ? item.image : `/artwork/${item.image}`) : "/placeholder-art.png"}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.artistName}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium">{item.currency ?? "$"}{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
