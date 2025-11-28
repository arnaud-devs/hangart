"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import type { Artist } from '@/data/SampleArtists';

type Props = {
  onClose: () => void;
  onSave: (a: Partial<Artist>) => void;
};

export default function AddArtistModal({ onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload: Partial<Artist> = { id: `artist-${Date.now()}`, name, city, country, specialization, bio };
    onSave(payload);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title="Add Artist">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Specialization</label>
          <input value={specialization} onChange={e => setSpecialization(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" rows={4} />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded bg-white dark:bg-gray-700">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-emerald-600 text-white rounded">Add</button>
        </div>
      </form>
    </Modal>
  );
}
