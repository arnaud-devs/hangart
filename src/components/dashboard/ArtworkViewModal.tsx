"use client";


import React from 'react';
import type { Artwork } from '@/lib/sampleArtworks';

export default function ArtworkViewModal({ artwork, onClose }: { artwork: any | null; onClose: () => void }) {
  if (!artwork) return null;

  // Collect all images: main + additional
  const images: string[] = [];
  if (artwork.image || artwork.main_image) images.push(artwork.image || artwork.main_image);
  if (Array.isArray(artwork.additional_images)) {
    artwork.additional_images.forEach((img: string) => {
      let src = img;
      if (src && !src.startsWith('http') && !src.startsWith('/')) {
        src = `https://hangart.pythonanywhere.com/media/artworks/images/${src}`;
      }
      images.push(src);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 z-10">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{artwork.title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">✕</button>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, idx) => (
              <img key={idx} src={src} alt={`${artwork.title} - Image ${idx + 1}`} className="w-full h-56 object-cover rounded" />
            ))}
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Description</h4>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{artwork.description || 'No description provided.'}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.views}</div>

          <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.likes}</div>

          <div className="text-sm text-gray-500 dark:text-gray-400">Income</div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.currency} {artwork.income?.toFixed ? artwork.income.toFixed(2) : artwork.income}</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}
