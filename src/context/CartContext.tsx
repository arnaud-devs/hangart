"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string | number;
  title: string;
  artistName?: string;
  image?: string;
  price?: number;
  currency?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "hangart_cart";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => String(p.id) === String(item.id));
      if (existing) {
        return prev.map((p) => (String(p.id) === String(item.id) ? { ...p, quantity: p.quantity + qty } : p));
      }
      return [...prev, { ...item, quantity: qty } as CartItem];
    });
    setOpen(true);
  }

  function removeItem(id: string | number) {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }

  function updateQuantity(id: string | number, qty: number) {
    if (qty <= 0) return removeItem(id);
    setItems((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, quantity: qty } : p)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(() => {
    return items.reduce((s, it) => s + (Number(it.price) || 0) * it.quantity, 0);
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, subtotal, open, setOpen }),
    [items, subtotal, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
