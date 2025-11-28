"use client";

import React from 'react';

type Artwork = {
  id: string;
  museumName: string;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  createdAt?: string;
};

export default function MuseumArtworkCard({ artwork, onEdit, onDelete }: { artwork: Artwork; onEdit?: (a: Artwork) => void; onDelete?: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4">
      <div className="w-28 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        {artwork.image ? <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No Image</div>}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold">{artwork.title}</div>
            <div className="text-xs text-gray-500">{artwork.museumName} • {new Date(artwork.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && <button onClick={() => onEdit(artwork)} className="text-sm px-2 py-1 border rounded">Edit</button>}
            {onDelete && <button onClick={() => onDelete(artwork.id)} className="text-sm px-2 py-1 text-red-600 border rounded">Delete</button>}
          </div>
        </div>
        {artwork.description && <div className="mt-2 text-sm text-gray-700">{artwork.description}</div>}
        {typeof artwork.price === 'number' && <div className="mt-3 text-sm font-semibold">Price: ${artwork.price.toFixed(2)}</div>}
      </div>
    </div>
  );
}
