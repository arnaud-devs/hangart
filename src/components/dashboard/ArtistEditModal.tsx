"use client";

import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import type { Artist } from '@/data/SampleArtists';

type Props = {
  artist: Artist | null;
  onClose: () => void;
  onSave: (a: Artist) => void;
};

export default function ArtistEditModal({ artist, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    if (artist) {
      setName(artist.name || '');
      setBio(artist.bio || '');
      setCity(artist.city || '');
      setCountry(artist.country || '');
      setSpecialization(artist.specialization || '');
    }
  }, [artist]);

  if (!artist) return null;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const updated: Artist = {
      ...artist,
      id: artist.id ?? `artist-${Date.now()}`,
      name: name.trim() || artist.name,
      bio: bio || artist.bio || '',
      city: city || artist.city || '',
      country: country || artist.country || '',
      specialization: specialization || artist.specialization || '',
    };
    onSave(updated);
    onClose();
  };

  return (
    <Modal open={!!artist} onClose={onClose} title={`Edit: ${artist?.name}`}>
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
          <button type="submit" className="px-3 py-1 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </form>
    </Modal>
  );
}
