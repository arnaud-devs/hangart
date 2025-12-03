// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  main_image: string;
  artist_name: string;
  quantity: number;
  is_available?: boolean; // Added for stock validation
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  itemCount: number;
  getItemQuantity: (id: number) => number; // Helper to get quantity for specific item
  isInCart: (id: number) => boolean; // Helper to check if item is in cart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hangart-cart');
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        // Validate that parsed items have the required structure
        if (Array.isArray(parsedItems)) {
          setItems(parsedItems);
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // Clear invalid cart data
        localStorage.removeItem('hangart-cart');
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('hangart-cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...newItem, quantity }];
      }
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (id: number): number => {
    const item = items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const isInCart = (id: number): boolean => {
    return items.some(item => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        open,
        setOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        getItemQuantity,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}