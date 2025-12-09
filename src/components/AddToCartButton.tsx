"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

type ToastType = 'success' | 'error' | 'login';

export default function AddToCartButton({ id, title, artistName, image, price, currency, quantity = 1 }: Props) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>('success');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handle = async () => {
    if (!isLoggedIn) {
      // Show login required toast
      setToastType('login');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setLoading(true);
    try {
      await addItem({ id: Number(id), title, artistName, image, price: Number(price) || 0, currency }, quantity);
      // Show success toast
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Show error toast
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        aria-label={`Add ${title} to cart`}
        className="inline-flex items-center gap-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-[#DFDFD6] px-4 py-2 disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>

      {/* Toast Notifications */}
      {showToast && toastType === 'success' && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold">Successfully added to cart!</p>
            <p className="text-sm text-green-100">{title} has been added</p>
          </div>
        </div>
      )}

      {showToast && toastType === 'error' && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div>
            <p className="font-semibold">Failed to add to cart</p>
            <p className="text-sm text-red-100">Please try again</p>
          </div>
        </div>
      )}

      {showToast && toastType === 'login' && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold">Please login first</p>
            <button
              onClick={() => {
                setShowToast(false);
                router.push("/login");
              }}
              className="text-sm underline hover:text-gray-200 mt-1"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
