"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Heart, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type ArtworkGalleryCardProps = {
  id: string | number
  title: string
  artist: string
  location: string
  medium: string
  dimensions: string
  price: string
  image: string
}

export default function ArtworkGalleryCard({
  id,
  title,
  artist,
  location,
  medium,
  dimensions,
  price,
  image,
}: ArtworkGalleryCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem, setOpen } = useCart();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('customWishlist');
      const list = raw ? JSON.parse(raw) : [];
      const exists = list.some((i: any) => String(i.artworkId) === String(id));
      setAdded(Boolean(exists));
    } catch (e) {
      // ignore
    }
  }, [id]);

  const addToWishlist = () => {
    try {
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;

      const buyerId = user?.id || 'guest';

      const raw = localStorage.getItem('customWishlist');
      const list = raw ? JSON.parse(raw) : [];

      const exists = list.some((i: any) => String(i.artworkId) === String(id) && i.buyerId === buyerId);
      if (!exists) {
        const entry = {
          id: `w-${Date.now()}`,
          artworkId: id,
          buyerId,
          addedAt: new Date().toISOString(),
        };
        const next = [entry, ...list];
        localStorage.setItem('customWishlist', JSON.stringify(next));
        setAdded(true);
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  const addToCart = () => {
    try {
      const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
      const numericId = typeof id === 'number' ? id : parseInt(String(id), 10);
      addItem(
        {
          id: numericId,
          title,
          artistName: artist,
          image,
          price: numericPrice,
          currency: price?.startsWith('$') ? '$' : undefined,
        },
        1
      );
      setOpen(true);
    } catch (e) {
      // ignore
    }
  };
  function StatusBadge({ status }: { status?: string }) {
    if (status === 'sold') return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium">Sold</span>;
    if (status === 'approved') return <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Approved</span>;
    if (status === 'submitted') return <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">Submitted</span>;
    if (status === 'draft') return <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-0.5 rounded text-xs font-medium">Draft</span>;
    if (status === 'rejected') return <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">Rejected</span>;
    if (status === 'archived') return <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">Archived</span>;
    return null;
  }

  return (
    <div className="group relative bg-[#F6F6F7] dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Image container with hover overlay */}
      <div className="relative aspect-4/3 bg-white dark:bg-gray-900 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Status badge overlay */}
        {('status' in arguments[0]) && arguments[0].status && (
          <div className="absolute top-2 left-2 z-10">
            <StatusBadge status={arguments[0].status} />
          </div>
        )}
        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            suppressHydrationWarning
            onClick={addToWishlist}
            className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${added ? 'ring-2 ring-emerald-200' : ''}`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${added ? 'text-red-500' : ''}`} />
          </button>
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Quick view"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            suppressHydrationWarning
            onClick={addToCart}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {price}
            </h3>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
              {title}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={addToWishlist} aria-label="Add to wishlist">
              <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
            </button>
            <button onClick={addToCart} aria-label="Add to cart">
              <ShoppingBag className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {artist}, {location}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {medium}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {dimensions}
        </p>
      </div>
    </div>
  )
}
