"use client";

import React, { useEffect, useState } from 'react';
import sampleArtworks, { type Artwork } from '@/lib/sampleArtworks';
import ArtworkViewModal from '@/components/dashboard/ArtworkViewModal';
import ArtworkEditModal from '@/components/dashboard/ArtworkEditModal';

const CUSTOM_KEY = 'customArtworks';

export default function Page() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [view, setView] = useState<Artwork | null>(null);
  const [edit, setEdit] = useState<Artwork | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const custom: Artwork[] = raw ? JSON.parse(raw) : [];
      // Merge custom updates with sample list (custom overrides by id)
      const map = new Map<string, Artwork>();
      [...sampleArtworks, ...custom].forEach(a => map.set(a.id, a));
      const merged = Array.from(map.values());
      const pending = merged.filter(a => a.status === 'pending');
      setItems(pending);
    } catch (e) {
      setItems(sampleArtworks.filter(a => a.status === 'pending'));
    }
  }, []);

  const persist = (updated: Artwork) => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Artwork[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(i => i.id !== updated.id);
      filtered.unshift(updated);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(filtered));
      // update UI
      setItems(prev => prev.filter(i => i.id !== updated.id));
    } catch (e) {
      console.error(e);
    }
  };

  const approve = (a: Artwork) => {
    const updated = { ...a, status: 'approved', approved: true } as Artwork;
    persist(updated);
  };

  const reject = (a: Artwork) => {
    const updated = { ...a, status: 'rejected', approved: false } as Artwork;
    persist(updated);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Approvals</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Review and approve or reject pending artworks.</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artwork</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {items.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-500 dark:text-gray-300">No pending artworks.</td></tr>
                )}
                {items.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={a.image} alt={a.title} className="w-20 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{a.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">{new Date(a.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{a.artistName}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => setView(a)} className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">View</button>
                        <button onClick={() => setEdit(a)} className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">Edit</button>
                        <button onClick={() => approve(a)} className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">Approve</button>
                        <button onClick={() => reject(a)} className="px-3 py-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-800">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {view && <ArtworkViewModal artwork={view} onClose={() => setView(null)} />}
      {edit && <ArtworkEditModal artwork={edit} onClose={() => setEdit(null)} onSave={persist} />}
    </div>
  );
}
