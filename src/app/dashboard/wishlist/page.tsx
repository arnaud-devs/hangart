"use client";

import React, { useMemo, useState } from 'react';
import sampleWishlist from '@/lib/sampleWishlist';
import sampleArtworks from '@/lib/sampleArtworks';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('customWishlist');
      return raw ? JSON.parse(raw) : sampleWishlist;
    } catch (e) {
      return sampleWishlist;
    }
  });

  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw ? JSON.parse(raw) : null;
  } catch (e) { user = null; }

  const myItems = useMemo(() => {
    if (!user || user.role !== 'BUYER') return items;
    return items.filter(i => i.buyerId === user.id);
  }, [items, user]);

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    try { localStorage.setItem('customWishlist', JSON.stringify(next)); } catch (e) {}
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <p className="text-sm text-gray-500">Artworks you saved for later.</p>
        </div>

        {myItems.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-sm text-gray-500">Your wishlist is empty.</div>
        ) : (
          <ul className="space-y-3">
            {myItems.map(i => {
              const art = sampleArtworks.find(a => a.id === i.artworkId);
              return (
                <li key={i.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={art?.image || '/arts/art1.jpg'} alt={art?.title} className="w-20 h-14 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{art?.title || 'Artwork'}</div>
                      <div className="text-xs text-gray-500">{art?.artistName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">${(art?.price||0).toFixed(2)}</div>
                    <button onClick={() => remove(i.id)} className="text-sm text-red-600 hover:underline">Remove</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
