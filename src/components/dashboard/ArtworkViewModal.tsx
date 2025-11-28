"use client";

import React from 'react';
import type { Artwork } from '@/lib/sampleArtworks';

export default function ArtworkViewModal({ artwork, onClose }: { artwork: Artwork | null; onClose: () => void }) {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 z-10">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{artwork.title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <img src={artwork.image} alt={artwork.title} className="w-full h-56 object-cover rounded" />
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">By {artwork.artistName}</div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.currency} {artwork.price.toFixed(2)}</div>
            <div className="mt-2">
              {artwork.status === 'approved' ? (
                <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-sm">Approved</span>
              ) : artwork.status === 'pending' ? (
                <span className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1 rounded-full text-sm">Pending</span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10 px-3 py-1 rounded-full text-sm">Rejected</span>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Description</h4>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{artwork.description || 'No description provided.'}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.views}</div>

              <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.likes}</div>

              <div className="text-sm text-gray-500 dark:text-gray-400">Income</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.currency} {artwork.income.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}
