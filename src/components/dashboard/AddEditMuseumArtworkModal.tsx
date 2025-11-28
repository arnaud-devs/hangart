"use client";

import React, { useState, useEffect } from 'react';

type Payload = {
  id?: string;
  museumName?: string;
  title?: string;
  description?: string;
  image?: string;
  price?: number;
};

export default function AddEditMuseumArtworkModal({ initial, onClose, onSave }: { initial?: Payload; onClose: () => void; onSave: (p: Payload) => void }) {
  const [museumName, setMuseumName] = useState(initial?.museumName || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [image, setImage] = useState(initial?.image || '');
  const [price, setPrice] = useState(initial?.price != null ? String(initial?.price) : '');

  useEffect(() => {
    setMuseumName(initial?.museumName || '');
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setImage(initial?.image || '');
    setPrice(initial?.price != null ? String(initial?.price) : '');
  }, [initial]);

  const submit = () => {
    if (!title || !museumName) return;
    const payload: Payload = {
      id: initial?.id,
      museumName,
      title,
      description,
      image,
      price: price ? Number(price) : undefined,
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">{initial?.id ? 'Edit Artwork' : 'Create Artwork'}</h3>
        <div className="grid grid-cols-1 gap-3">
          <input value={museumName} onChange={e => setMuseumName(e.target.value)} placeholder="Museum name" className="border px-3 py-2 rounded" />
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border px-3 py-2 rounded" />
          <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="border px-3 py-2 rounded" />
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (optional)" className="border px-3 py-2 rounded" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border px-3 py-2 rounded h-28" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
