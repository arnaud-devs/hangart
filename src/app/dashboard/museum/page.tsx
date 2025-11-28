"use client";

import React, { useEffect, useState } from 'react';
import MuseumArtworkCard from '@/components/dashboard/MuseumArtworkCard';
import AddEditMuseumArtworkModal from '@/components/dashboard/AddEditMuseumArtworkModal';

type Artwork = {
  id: string;
  museumName: string;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  createdAt?: string;
};

const STORAGE_KEY = 'museumArtworks';

export default function Page() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Artwork | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Artwork[] = raw ? JSON.parse(raw) : [];
      setArtworks(list);
    } catch (e) {
      setArtworks([]);
    }
  }, []);

  const save = (payload: Partial<Artwork>) => {
    if (payload.id) {
      const updated = artworks.map(a => a.id === payload.id ? { ...a, ...payload, createdAt: a.createdAt || new Date().toISOString() } as Artwork : a);
      setArtworks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return;
    }
    const newArt: Artwork = {
      id: `museum-art-${Date.now()}`,
      museumName: payload.museumName || 'Museum',
      title: payload.title || 'Untitled',
      description: payload.description || '',
      image: payload.image || '',
      price: payload.price,
      createdAt: new Date().toISOString(),
    };
    const updated = [newArt, ...artworks];
    setArtworks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const remove = (id: string) => {
    const updated = artworks.filter(a => a.id !== id);
    setArtworks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Museum Dashboard</h1>
            <p className="text-sm text-gray-500">Post artworks and manage your gallery entries.</p>
          </div>
          <div>
            <button onClick={() => { setEditing(null); setShowAdd(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded">Create Artwork</button>
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="text-sm text-gray-500">No artworks yet. Create one to showcase.</div>
        ) : (
          <div className="space-y-3">
            {artworks.map(a => (
              <MuseumArtworkCard key={a.id} artwork={a} onEdit={(x) => { setEditing(x); setShowAdd(true); }} onDelete={remove} />
            ))}
          </div>
        )}
      </div>
      {showAdd && <AddEditMuseumArtworkModal initial={editing || undefined} onClose={() => setShowAdd(false)} onSave={save} />}
    </div>
  );
}
