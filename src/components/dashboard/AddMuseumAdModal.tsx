"use client";

import React, { useState } from 'react';

type Payload = {
  museumName?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

export default function AddMuseumAdModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Payload) => void }) {
  const [museumName, setMuseumName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');

  const submit = () => {
    if (!title || !museumName) return;
    onSave({ museumName, title, description, url, image });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Create Museum Advertisement</h3>
        <div className="grid grid-cols-1 gap-3">
          <input value={museumName} onChange={e => setMuseumName(e.target.value)} placeholder="Museum name" className="border px-3 py-2 rounded" />
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ad title" className="border px-3 py-2 rounded" />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="External URL (optional)" className="border px-3 py-2 rounded" />
          <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="border px-3 py-2 rounded" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="border px-3 py-2 rounded h-24" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
