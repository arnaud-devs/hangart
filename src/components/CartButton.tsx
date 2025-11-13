"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { items, setOpen } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Open cart with ${count} items`}
      className="relative w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-gray-800 dark:text-white"
    >
      <ShoppingCart />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs w-5 h-5">
          {count}
        </span>
      )}
    </button>
  );
}
