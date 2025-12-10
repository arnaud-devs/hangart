"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type WishlistEntry = {
  id: string;
  artworkId: string | number;
  buyerId: string | number;
  addedAt: string;
  title?: string;
  artistName?: string;
  image?: string;
  price?: number | string;
  currency?: string;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('customWishlist');
      const list: WishlistEntry[] = raw ? JSON.parse(raw) : [];
      setItems(list);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const groupedByArtwork = useMemo(() => {
    const map = new Map<string, WishlistEntry>();
    for (const it of items) {
      map.set(String(it.artworkId), it);
    }
    return Array.from(map.values());
  }, [items]);

  const removeItem = (artworkId: string | number) => {
    try {
      const raw = localStorage.getItem('customWishlist');
      const list: WishlistEntry[] = raw ? JSON.parse(raw) : [];
      const next = list.filter((i) => String(i.artworkId) !== String(artworkId));
      localStorage.setItem('customWishlist', JSON.stringify(next));
      setItems(next);
    } catch (e) {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-300">Loading wishlist…</div>
      </div>
    );
  }

  if (groupedByArtwork.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Browse artworks and add favorites to your wishlist.</p>
          <Link href="/artists" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Explore artists</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedByArtwork.map((it) => (
            <li key={String(it.artworkId)} className="bg-white/90 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl shadow border border-black/5 dark:border-white/10">
              <div className="relative aspect-4/3 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                <Image
                  src={it.image ? (String(it.image).startsWith('/') ? String(it.image) : `/artwork/${it.image}`) : '/placeholder-art.png'}
                  alt={String(it.title || it.artworkId)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold truncate">{it.title || `Artwork #${it.artworkId}`}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{it.artistName || 'Unknown artist'}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {typeof it.price !== 'undefined' ? (
                      <span>{it.currency ?? '$'}{it.price}</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">Added {new Date(it.addedAt).toLocaleDateString()}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => removeItem(it.artworkId)}
                    className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Remove
                  </button>
                  <Link
                    href={`/artworks/${it.artworkId}`}
                    className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
