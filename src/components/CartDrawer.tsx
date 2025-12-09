"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";
import { Loader2, Trash2, ShoppingCart, Minus, Plus, X } from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const { items, subtotal, open, setOpen, updateQuantity, removeItem, clearCart, loading, error } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingItemId(id);
    try {
      await updateQuantity(id, quantity);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (id: number) => {
    setUpdatingItemId(id);
    try {
      await removeItem(id);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    setIsClearing(true);
    try {
      await clearCart();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div
      aria-hidden={!open}
      role="dialog"
      aria-label="Shopping cart"
      className={`fixed inset-0 z-50 transition-all ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Your Cart ({items.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                aria-label="Clear cart"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
              >
                {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Clear'}
              </button>
            )}
            <button
              aria-label="Close cart"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="p-4 overflow-y-auto h-[calc(100%-220px)]">
          {loading && items.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">Your cart is empty</p>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push('/gallery');
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item: CartItem) => {
                const imageSrc = item.image || item.main_image || '/placeholder-art.png';
                const artistDisplay = item.artistName || item.artist_name || 'Unknown Artist';
                const currencySymbol = item.currency || '$';
                const isUpdating = updatingItemId === item.id;

                return (
                  <li
                    key={item.id}
                    className={`flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-opacity ${isUpdating ? 'opacity-50' : ''}`}
                  >
                    {/* Image */}
                    <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-1">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {item.title}
                        </h3>
                        <button
                          aria-label={`Remove ${item.title}`}
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{artistDisplay}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="text-gray-500 dark:text-gray-500">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            aria-label="Proceed to checkout"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
          
          <button
            onClick={() => {
              setOpen(false);
              router.push('/gallery');
            }}
            className="w-full mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
