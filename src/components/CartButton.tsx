"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const { items } = useCart();
  const router = useRouter();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <button
      suppressHydrationWarning
      onClick={() => router.push("/cart")}
      aria-label={`Open cart with ${count} items`}
      className="relative w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-gray-800 dark:text-[#DFDFD6]"
    >
      <ShoppingCart />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-[#DFDFD6] text-xs w-5 h-5">
          {count}
        </span>
      )}
    </button>
  );
}
