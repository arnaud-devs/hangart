"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/appClient";
import { CheckCircle, XCircle } from "lucide-react";

type ToastType = 'success' | 'error';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>('success');
  const [toastMessage, setToastMessage] = useState('');
  
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    shippingFee: "10.00",
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push(`/login?redirect=/checkout`);
          return;
        }
        
        // Check user role
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const userRole = (userData.role || '').toString().toLowerCase();
            if (userRole !== 'buyer') {
              router.push('/');
              return;
            }
          } catch (e) {
            console.error("Failed to parse stored user data");
          }
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        router.push(`/login?redirect=/checkout`);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router]);

  const shippingCost = parseFloat(formData.shippingFee) || 10.00;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToastMessage = (type: ToastType, message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.address || !formData.city || !formData.country) {
        setError("Please fill in all required shipping fields");
        setLoading(false);
        return;
      }

      // Validate cart items
      if (items.length === 0) {
        setError("Your cart is empty");
        setLoading(false);
        return;
      }

      // Build shipping address string
      const shippingAddress = `${formData.address}, ${formData.city}${formData.postalCode ? ', ' + formData.postalCode : ''}, ${formData.country}`;

      // Prepare order payload
      const orderPayload = {
        items: items.map(item => ({
          artwork_id: Number(item.id),
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        shipping_fee: formData.shippingFee
      };

      // Create order via API
      const order = await createOrder(orderPayload);
      
      // Clear cart on success
      await clearCart();
      
      // Show success toast
      showToastMessage('success', `Order ${order.order_number} created successfully!`);
      
      // Redirect to success page with order details after a brief delay
      setTimeout(() => {
        router.push(`/checkout/success?orderNumber=${order.order_number}&orderId=${order.id}`);
      }, 1500);

    } catch (err: any) {
      console.error("Order creation error:", err);
      const errorMessage = err.message || "Failed to create order. Please try again.";
      setError(errorMessage);
      showToastMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
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
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Checkout</h1>

        {/* Toast Notifications */}
        {showToast && toastType === 'success' && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">{toastMessage}</p>
            </div>
          </div>
        )}

        {showToast && toastType === 'error' && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <XCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">{toastMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-md p-6 border border-black/5 dark:border-white/10">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Shipping Information</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Kigali"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="10101"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Rwanda"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="shippingFee" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Shipping Fee
                </label>
                <input
                  type="number"
                  id="shippingFee"
                  name="shippingFee"
                  step="0.01"
                  min="0"
                  value={formData.shippingFee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Default: $10.00</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full mt-6 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? "Creating Order..." : "Place Order"}
              </button>
            </form>
          </div>
          {/* Order Summary */}
          <div className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow-md p-6 h-fit border border-black/5 dark:border-white/10">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const imageSrc = item.image || item.main_image || '/placeholder-art.png';
                const artistDisplay = item.artistName || item.artist_name || 'Unknown Artist';
                const currencySymbol = item.currency || '$';
                
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{artistDisplay}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <span className="text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-gray-900 dark:text-gray-100">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> After placing your order, you&apos;ll be redirected to complete payment. Your order will be confirmed once payment is successful.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
