// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart as apiClearCart } from '@/lib/appClient';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  main_image?: string;
  // Backwards-compatible fields used throughout the app
  image?: string;
  artist_name?: string;
  artistName?: string;
  // currency may be provided by some components
  currency?: string;
  quantity: number;
  is_available?: boolean; // Added for stock validation
}

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  getItemQuantity: (id: number) => number;
  isInCart: (id: number) => boolean;
  loading: boolean;
  error: string | null;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
        if (hasToken) {
          const response = await getCart();
          if (response && response.items) {
            const normalizedItems = response.items.map((item: any) => ({
              id: item.artwork?.id || item.id,
              title: item.artwork?.title || item.title,
              price: parseFloat(item.artwork?.price || item.price || 0),
              main_image: item.artwork?.main_image || item.main_image,
              image: item.artwork?.main_image || item.main_image || '',
              artist_name: item.artwork?.artist?.username || item.artist_name || '',
              artistName: item.artwork?.artist?.username || item.artist_name || '',
              quantity: item.quantity,
              is_available: item.artwork?.is_available ?? true,
            }));
            setItems(normalizedItems);
          }
        } else {
          // Not authenticated: use localStorage cart without hitting API
          const savedCart = localStorage.getItem('hangart-cart');
          if (savedCart) {
            try {
              const parsedItems = JSON.parse(savedCart);
              if (Array.isArray(parsedItems)) {
                const normalized = parsedItems.map((it: any) => ({
                  ...it,
                  image: it.image || it.main_image || '',
                  artistName: it.artistName || it.artist_name || '',
                  currency: it.currency || '$',
                }));
                setItems(normalized);
              }
            } catch (e) {
              console.error('Failed to parse cart from localStorage:', e);
              localStorage.removeItem('hangart-cart');
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load cart:', err);
        // Fall back to localStorage if API fails
        const savedCart = localStorage.getItem('hangart-cart');
        if (savedCart) {
          try {
            const parsedItems = JSON.parse(savedCart);
            if (Array.isArray(parsedItems)) {
              const normalized = parsedItems.map((it: any) => ({
                ...it,
                image: it.image || it.main_image || '',
                artistName: it.artistName || it.artist_name || '',
                currency: it.currency || '$',
              }));
              setItems(normalized);
            }
          } catch (e) {
            console.error('Failed to parse cart from localStorage:', e);
            localStorage.removeItem('hangart-cart');
          }
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadCart();
  }, []);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const syncCart = async () => {
    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (!hasToken) return; // skip API sync when not authenticated
      const response = await getCart();
      if (response && response.items) {
        const normalizedItems = response.items.map((item: any) => ({
          id: item.artwork?.id || item.id,
          title: item.artwork?.title || item.title,
          price: parseFloat(item.artwork?.price || item.price || 0),
          main_image: item.artwork?.main_image || item.main_image,
          image: item.artwork?.main_image || item.main_image || '',
          artist_name: item.artwork?.artist?.username || item.artist_name || '',
          artistName: item.artwork?.artist?.username || item.artist_name || '',
          quantity: item.quantity,
          is_available: item.artwork?.is_available ?? true,
        }));
        setItems(normalizedItems);
      }
    } catch (err: any) {
      console.error('Failed to sync cart:', err);
      setError('Failed to sync cart');
    }
  };

  const addItem = async (newItem: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setError(null);
    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (hasToken) {
        await addToCart(newItem.id, quantity);
        await syncCart();
      } else {
        // Not authenticated: update local state only
        setItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === newItem.id);
          if (existingItem) {
            return prevItems.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const normalizedNew = {
              ...newItem,
              quantity,
              image: (newItem as any).image || (newItem as any).main_image || '',
              artistName: (newItem as any).artistName || (newItem as any).artist_name || '',
              currency: (newItem as any).currency || '$',
            } as CartItem;
            return [...prevItems, normalizedNew];
          }
        });
      }
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      // Fallback: add to local state
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newItem.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const normalizedNew = {
            ...newItem,
            quantity,
            image: (newItem as any).image || (newItem as any).main_image || '',
            artistName: (newItem as any).artistName || (newItem as any).artist_name || '',
            currency: (newItem as any).currency || '$',
          } as CartItem;
          return [...prevItems, normalizedNew];
        }
      });
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    setError(null);
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (hasToken) {
        await updateCartItem(id, quantity);
        await syncCart();
      } else {
        // Not authenticated: update local state only
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      setError(err.message || 'Failed to update quantity');
      // Fallback: update local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = async (id: number) => {
    setError(null);
    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (hasToken) {
        await removeFromCart(id);
        await syncCart();
      } else {
        // Not authenticated: remove locally
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      }
    } catch (err: any) {
      console.error('Failed to remove item:', err);
      setError(err.message || 'Failed to remove item');
      // Fallback: remove from local state
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const clearCart = async () => {
    setError(null);
    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (hasToken) {
        await apiClearCart();
      }
      setItems([]);
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError(err.message || 'Failed to clear cart');
      // Fallback: clear local state
      setItems([]);
    }
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
        loading,
        error,
        syncCart,
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