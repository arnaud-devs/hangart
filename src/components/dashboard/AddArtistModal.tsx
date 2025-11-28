"use client";

import React, { useState } from 'react';
import type { Artist } from '@/data/SampleArtists';

export default function AddArtistModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Partial<Artist>) => void }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, city, country, specialization, bio });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <h3 className="text-lg font-semibold mb-4">Add Artist</h3>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Specialization</label>
            <input value={specialization} onChange={e => setSpecialization(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Add</button>
        </div>
      </form>
    </div>
  );
}
