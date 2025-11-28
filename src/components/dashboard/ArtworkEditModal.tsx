"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import type { Artwork } from '@/lib/sampleArtworks';

type Props = {
  artwork: Artwork | null;
  onClose: () => void;
  onSave: (a: Artwork) => void;
};

export default function ArtworkEditModal({ artwork, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('0');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Artwork['status']>('pending');

  useEffect(() => {
    if (artwork) {
      setTitle(artwork.title || '');
      setPrice(String(artwork.price ?? 0));
      setImage(artwork.image || '');
      setDescription(artwork.description || '');
      setStatus(artwork.status || 'pending');
    }
  }, [artwork]);

  if (!artwork) return null;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const updated: Artwork = {
      ...artwork,
      title: title.trim() || artwork.title,
      price: Number(price) || 0,
      image: image || artwork.image,
      description: description || artwork.description,
      status,
    };
    onSave(updated);
    onClose();
  };

  return (
    <Modal open={!!artwork} onClose={onClose} title={`Edit: ${artwork.title}`}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" min="0" step="0.01" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Image URL</label>
          <input value={image} onChange={e => setImage(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as Artwork['status'])} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" rows={4} />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded bg-white dark:bg-gray-700">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </form>
    </Modal>
  );
}
