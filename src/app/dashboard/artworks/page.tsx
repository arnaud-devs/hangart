"use client";

import React, { useEffect, useState } from 'react'
import ArtworksTable from '@/components/dashboard/ArtworksTable'
import sampleArtworks, { type Artwork } from '@/lib/sampleArtworks'

const CUSTOM_KEY = 'customArtworks';

export default function Page() {
  const [artworks, setArtworks] = useState<Artwork[]>(() => sampleArtworks);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const artistId = user?.id || 'artist-01';

      // load custom artworks from localStorage and merge
      const raw = localStorage.getItem(CUSTOM_KEY);
      const custom: Artwork[] = raw ? JSON.parse(raw) : [];
      const myCustom = custom.filter(c => c.artistId === artistId);

      const base = sampleArtworks.filter(a => a.artistId === artistId);
      const combined = [...myCustom, ...base];
      // If the artist has no specific artworks (e.g., admin or different role), fall back to full sample data
      if (combined.length === 0) {
        setArtworks([...myCustom, ...sampleArtworks]);
      } else {
        setArtworks(combined);
      }
    } catch (e) {
      setArtworks(sampleArtworks.filter(a => a.artistId === 'artist-01'));
    }
  }, []);

  const saveCustom = (art: Artwork) => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Artwork[] = raw ? JSON.parse(raw) : [];
      list.unshift(art);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  };

  const addArtwork = (payload: Partial<Artwork>) => {
    try {
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : { id: 'artist-01', firstName: 'Amina', lastName: 'Uwimana' };
      const id = `art-${Date.now()}`;
      const art: Artwork = {
        id,
        title: payload.title || 'Untitled',
        artistId: user.id,
        artistName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
        price: Number(payload.price) || 0,
        currency: payload.currency || 'USD',
        approved: false,
        status: 'pending',
        createdAt: new Date().toISOString(),
        image: payload.image || '/arts/art1.jpg',
        views: 0,
        likes: 0,
        income: 0,
        description: payload.description || ''
      };

      // persist and update state
      saveCustom(art);
      setArtworks(prev => [art, ...prev]);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteArtwork = (id: string) => {
    try {
      setArtworks(prev => prev.filter(a => a.id !== id));
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Artwork[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(i => i.id !== id);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

    const updateArtwork = (updated: Artwork) => {
      try {
        // update in-memory state
        setArtworks(prev => prev.map(a => a.id === updated.id ? updated : a));

        // persist to custom list (replace or add)
        const raw = localStorage.getItem(CUSTOM_KEY);
        const list: Artwork[] = raw ? JSON.parse(raw) : [];
        const filtered = list.filter(i => i.id !== updated.id);
        filtered.unshift(updated);
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }
    };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Artworks</h2>
          <div>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded">Add Artwork</button>
          </div>
        </div>

        <ArtworksTable artworks={artworks} onUpdate={updateArtwork} onDelete={deleteArtwork} />
      </div>

      {showModal && (
        <ArtworkModal onClose={() => setShowModal(false)} onSave={addArtwork} />
      )}
    </div>
  );
}

function ArtworkModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Partial<Artwork>) => void }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, price: Number(price), image, description, currency: 'USD' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <h3 className="text-lg font-semibold mb-4">Add New Artwork</h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" type="number" min="0" step="0.01" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input value={image} onChange={e => setImage(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="/arts/art1.jpg or https://..." />
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
