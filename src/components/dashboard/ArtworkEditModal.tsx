"use client";

import React, { useState } from 'react';
import type { Artwork } from '@/lib/sampleArtworks';

type Props = {
  artwork: Artwork | null;
  onClose: () => void;
  onSave: (a: Artwork) => void;
};

export default function ArtworkEditModal({ artwork, onClose, onSave }: Props) {
  const [title, setTitle] = useState(artwork?.title || '');
  const [price, setPrice] = useState(artwork ? String(artwork.price) : '0');
  const [image, setImage] = useState(artwork?.image || '');
  const [description, setDescription] = useState(artwork?.description || '');
  const [status, setStatus] = useState<Artwork['status']>(artwork?.status || 'pending');

  if (!artwork) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Artwork = {
      ...artwork,
      title: title.trim() || artwork.title,
      price: Number(price) || 0,
      image: image || artwork.image,
      description: description || artwork.description,
      status
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Edit Artwork</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" type="number" min="0" step="0.01" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as Artwork['status'])} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
