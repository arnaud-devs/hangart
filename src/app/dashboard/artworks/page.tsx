"use client";

import React, { useEffect, useState } from 'react'
import ArtworksTable from '@/components/dashboard/ArtworksTable'
import { artworkService, artistService } from '@/services/apiServices'
import { useAuth } from '@/lib/authProvider'
// removed unused duplicate imports

export default function Page() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArtworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      // If artist, load my artworks; otherwise load public artworks
      if (user?.role === 'artist') {
        const res: any = await artistService.getMyArtworks();
        setArtworks(res.results || res || []);
      } else {
        const res: any = await artworkService.listArtworks();
        setArtworks(res.results || res || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const createArtwork = async (formData: FormData) => {
    try {
      const created = await artworkService.createArtwork(formData as any);
      setArtworks(prev => [created as any, ...prev]);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create artwork');
    }
  };

  const updateArtwork = async (id: number, payload: any) => {
    try {
      const updated = await artworkService.updateArtwork(id, payload);
      setArtworks(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (err: any) {
      setError(err.message || 'Failed to update artwork');
    }
  };

  const deleteArtwork = async (id: number) => {
    try {
      await artworkService.deleteArtwork(id);
      setArtworks(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete artwork');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Artworks</h2>
          <div>
            {user?.role === 'artist' && (
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded">Add Artwork</button>
            )}
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <ArtworksTable artworks={artworks} onUpdate={(a: any) => updateArtwork(a.id, a)} onDelete={(id: any) => deleteArtwork(id)} />
      </div>

      {showModal && (
        <ArtworkModal onClose={() => setShowModal(false)} onSave={createArtwork} />
      )}
    </div>
  );
}

function ArtworkModal({ onClose, onSave }: { onClose: () => void; onSave: (fd: FormData) => void }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('price', price);
    fd.append('description', description);
    if (imageFile) fd.append('main_image', imageFile);
    onSave(fd);
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <form onSubmit={submit} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 text-gray-900 dark:text-gray-100">
          <h3 className="text-lg font-semibold mb-4">Add New Artwork</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
              <input value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" type="number" min="0" step="0.01" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Main Image (file)</label>
              <input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} accept="image/*" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

