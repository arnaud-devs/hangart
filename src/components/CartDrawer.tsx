"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";

export default function CartDrawer() {
  const router = useRouter();
  const { items, subtotal, open, setOpen, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
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
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <div className="flex items-center gap-2">
            <button aria-label="Clear cart" onClick={() => clearCart()} className="text-sm text-red-600">Clear</button>
            <button aria-label="Close cart" onClick={() => setOpen(false)} className="text-2xl leading-none">×</button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-220px)]">
          {items.length === 0 ? (
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">Your cart is empty.</div>
          ) : (
            <ul className="space-y-4">
              {items.map((it: CartItem) => (
                <li key={String(it.id)} className="flex items-center gap-3">
                  <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={it.image ? (it.image.startsWith("/") ? it.image : `/artwork/${it.image}`) : "/placeholder-art.png"}
                      alt={it.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{it.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{it.artistName}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm">Qty</label>
                      <input
                        aria-label={`Quantity for ${it.title}`}
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => updateQuantity(it.id, Number(e.target.value))}
                        className="w-16 rounded-md border px-2 py-1 text-sm"
                      />
                      <div className="ml-auto text-sm font-medium">{it.currency ?? "$"}{it.price}</div>
                      <button aria-label={`Remove ${it.title}`} onClick={() => removeItem(it.id)} className="text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gray-600 dark:text-gray-300">Estimate shipping</span>
            <span className="text-gray-500">—</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full rounded-md bg-yellow-600 hover:bg-yellow-700 text-[#DFDFD6] px-4 py-2 disabled:opacity-50"
            aria-label="Proceed to checkout"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
