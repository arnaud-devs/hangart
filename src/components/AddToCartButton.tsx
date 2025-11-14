"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  id: string | number;
  title: string;
  artistName?: string;
  image?: string;
  price?: number | string;
  currency?: string;
  quantity?: number;
};

export default function AddToCartButton({ id, title, artistName, image, price, currency, quantity = 1 }: Props) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    try {
      addItem({ id, title, artistName, image, price: Number(price) || 0, currency }, quantity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={loading}
      aria-label={`Add ${title} to cart`}
      className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-[#DFDFD6] px-4 py-2 disabled:opacity-60"
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
