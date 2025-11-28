"use client";

import React, { useEffect, useState } from 'react';

type Museum = {
  id?: string;
  name?: string;
  description?: string;
  website?: string;
  country?: string;
  city?: string;
  image?: string;
  status?: 'active' | 'inactive';
};

export default function AddEditMuseumModal({ initial, onClose, onSave }: { initial?: Museum; onClose: () => void; onSave: (m: Museum) => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [website, setWebsite] = useState(initial?.website || '');
  const [country, setCountry] = useState(initial?.country || '');
  const [city, setCity] = useState(initial?.city || '');
  const [image, setImage] = useState(initial?.image || '');
  const [status, setStatus] = useState<Museum['status']>(initial?.status || 'active');

  useEffect(() => {
    setName(initial?.name || '');
    setDescription(initial?.description || '');
    setWebsite(initial?.website || '');
    setCountry(initial?.country || '');
    setCity(initial?.city || '');
    setImage(initial?.image || '');
    setStatus(initial?.status || 'active');
  }, [initial]);

  const submit = () => {
    if (!name) return;
    const payload: Museum = {
      id: initial?.id,
      name,
      description,
      website,
      country,
      city,
      image,
      status,
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">{initial?.id ? 'Edit Museum' : 'Add Museum'}</h3>
        <div className="grid grid-cols-1 gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Museum name" className="border px-3 py-2 rounded" />
          <div className="grid grid-cols-2 gap-2">
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="border px-3 py-2 rounded" />
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="border px-3 py-2 rounded" />
          </div>
          <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website" className="border px-3 py-2 rounded" />
          <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="border px-3 py-2 rounded" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="border px-3 py-2 rounded h-28" />
          <div>
            <label className="text-sm mr-3"><input type="radio" name="status" checked={status === 'active'} onChange={() => setStatus('active')} /> Active</label>
            <label className="text-sm ml-4"><input type="radio" name="status" checked={status === 'inactive'} onChange={() => setStatus('inactive')} /> Inactive</label>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
