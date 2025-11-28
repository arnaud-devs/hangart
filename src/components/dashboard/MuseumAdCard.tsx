"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Ad = {
  id: string;
  museumName: string;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  createdAt?: string;
};

export default function MuseumAdCard({ ad, onDelete }: { ad: Ad; onDelete?: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm p-0">
      <div className="flex gap-4">
        <div className="w-32 h-24 relative flex-shrink-0 bg-gray-100">
          {ad.image ? (
            // use next/image for optimized images when possible
            <Image src={ad.image} alt={ad.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 200px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No Image</div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">{ad.museumName}</div>
              <div className="font-semibold text-lg">{ad.title}</div>
              {ad.description && <div className="mt-2 text-sm text-gray-700">{ad.description}</div>}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {ad.url && (
                <Link href={ad.url} className="text-sm text-emerald-600 hover:underline" target="_blank">Visit</Link>
              )}
              {onDelete && (
                <button onClick={() => onDelete(ad.id)} className="text-sm text-red-600">Delete</button>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : ''}</div>
        </div>
      </div>
    </div>
  );
}
