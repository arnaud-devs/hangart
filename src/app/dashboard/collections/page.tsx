
"use client";

import React, { useEffect, useState } from 'react';
import sampleCollections, { type CollectionItem } from '@/data/sampleMuseumCollections';
import Modal from '@/components/ui/Modal';
import sampleArtworks from '@/lib/sampleArtworks';

const STORAGE_KEY = 'museumCollections';

export default function Page() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [editing, setEditing] = useState<CollectionItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: CollectionItem[] = raw ? JSON.parse(raw) : [];
      // merge sample and custom (custom wins)
      const map = new Map<string, CollectionItem>();
      [...list, ...sampleCollections].forEach(c => map.set(c.id, c));
      setCollections(Array.from(map.values()));
    } catch (e) {
      setCollections(sampleCollections);
    }
  }, []);

  const save = (payload: Partial<CollectionItem>) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: CollectionItem[] = raw ? JSON.parse(raw) : [];
      if (payload.id) {
        const updated = collections.map(c => c.id === payload.id ? { ...c, ...(payload as CollectionItem) } : c);
        setCollections(updated);
        const filtered = list.filter(i=>i.id !== payload.id);
        filtered.unshift(payload as CollectionItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return;
      }
      const id = `col-${Date.now()}`;
      const newItem: CollectionItem = {
        id,
        title: payload.title || 'New Collection',
        description: payload.description || '',
        artworks: payload.artworks || [],
        totalValue: payload.totalValue || 0,
        views: payload.views || 0,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...collections];
      setCollections(updated);
      list.unshift(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const remove = (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const filteredCustom = list.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCustom));
      setCollections(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const [viewCollection, setViewCollection] = useState<CollectionItem | null>(null);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Collections</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">Manage your museum collections and their artworks.</p>
          </div>
          <div>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded">Add Collection</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Artworks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Views</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white dark:bg-gray-800 dark:divide-gray-700">
              {collections.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{c.title}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-300">{(c.artworks||[]).length} items</div>
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-gray-600 dark:text-gray-300">{c.description || <span className="text-gray-300 dark:text-gray-500">—</span>}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      {(c.artworks||[]).slice(0,4).map(aid => {
                        const art = sampleArtworks.find(s => String(s.id) === String(aid));
                        return art ? (
                          <div key={aid} className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                          </div>
                        ) : null
                      })}
                      {(c.artworks||[]).length > 4 ? <div className="text-xs text-gray-500 dark:text-gray-300">+{(c.artworks||[]).length - 4}</div> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-gray-900 dark:text-gray-100">${((c.totalValue)||0).toFixed(2)}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-900 dark:text-gray-100">{c.views || 0}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-500 dark:text-gray-300">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 align-top text-right">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => setViewCollection(c)} className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700">View</button>
                      <button onClick={() => { setEditing(c); setShowForm(true); }} className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700">Edit</button>
                      <button onClick={() => remove(c.id)} className="px-3 py-1 text-red-600 border rounded text-sm bg-white dark:bg-gray-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Collection' : 'New Collection'}>
            <CollectionForm initial={editing || undefined} onCancel={() => setShowForm(false)} onSave={(p) => { save(p); setShowForm(false); }} />
          </Modal>
        )}

        {viewCollection && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{viewCollection.title}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{viewCollection.description}</div>
                </div>
                <div>
                  <button onClick={() => setViewCollection(null)} className="px-3 py-1 border rounded bg-white dark:bg-gray-700">Close</button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(viewCollection.artworks||[]).map(aid => {
                  const art = sampleArtworks.find(s => String(s.id) === String(aid));
                  if (!art) return null;
                  return (
                    <div key={aid} className="flex items-center gap-3 p-2 border rounded bg-white dark:bg-gray-700">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 overflow-hidden rounded"><img src={art.image} alt={art.title} className="w-full h-full object-cover" /></div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{art.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">{art.artistName}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-200 mt-1">{art.currency ?? '$'}{art.price}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionForm({ initial, onSave, onCancel }: { initial?: CollectionItem; onSave: (p: Partial<CollectionItem>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [artworks, setArtworks] = useState<string[]>(initial?.artworks || []);
  const [totalValue, setTotalValue] = useState<number>(initial?.totalValue || 0);
  const [views, setViews] = useState<number>(initial?.views || 0);

  const toggleArtwork = (id: string) => setArtworks(prev => prev.includes(id) ? prev.filter(p=>p!==id) : [id, ...prev]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} className="border px-3 py-2 rounded" placeholder="Title" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="border px-3 py-2 rounded" placeholder="Description" />
        <div className="text-sm text-gray-600">Pick artworks to include</div>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-auto">
          {sampleArtworks.map(a => (
            <button key={a.id} onClick={() => toggleArtwork(a.id)} className={`p-2 border rounded flex items-center gap-2 text-left ${artworks.includes(a.id) ? 'ring-2 ring-emerald-300' : ''}`}>
              <div className="w-12 h-12 bg-gray-100 overflow-hidden rounded"><img src={a.image} alt={a.title} className="w-full h-full object-cover" /></div>
              <div className="text-xs">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">{a.artistName}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="number" value={totalValue} onChange={e=>setTotalValue(Number(e.target.value))} className="border px-3 py-2 rounded" placeholder="Total value" />
          <input type="number" value={views} onChange={e=>setViews(Number(e.target.value))} className="border px-3 py-2 rounded" placeholder="Views" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => onSave({ id: initial?.id, title, description, artworks, totalValue, views })} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </div>
  );
}
