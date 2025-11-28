"use client";

import React, { useEffect, useState } from 'react';
import sampleMuseums from '@/data/SampleMuseums';
import AddEditMuseumModal from '@/components/dashboard/AddEditMuseumModal';

type Museum = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
  city?: string;
  image?: string;
  status?: 'active' | 'inactive';
};

const CUSTOM_KEY = 'customMuseums';

export default function Page() {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [editing, setEditing] = useState<Museum | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const custom: Museum[] = raw ? JSON.parse(raw) : [];
      const map = new Map<string, Museum>();
      [...sampleMuseums, ...custom].forEach(m => map.set(m.id, m));
      setMuseums(Array.from(map.values()));
    } catch (e) {
      setMuseums(sampleMuseums);
    }
  }, []);

  const save = (payload: Partial<Museum>) => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Museum[] = raw ? JSON.parse(raw) : [];
      if (payload.id) {
        // update
        const updated = museums.map(m => m.id === payload.id ? { ...m, ...payload } as Museum : m);
        setMuseums(updated);
        const filtered = list.filter(i => i.id !== payload.id);
        filtered.unshift({ ...(payload as Museum) });
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(filtered));
        return;
      }
      const id = `museum-${Date.now()}`;
      const newItem: Museum = {
        id,
        name: payload.name || 'Unnamed Museum',
        description: payload.description || '',
        website: payload.website || '',
        country: payload.country || '',
        city: payload.city || '',
        image: payload.image || '',
        status: payload.status || 'active',
      };
      const updated = [newItem, ...museums];
      setMuseums(updated);
      list.unshift(newItem);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const remove = (id: string) => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const filteredCustom = list.filter(i => i.id !== id);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(filteredCustom));
      setMuseums(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // compute total artworks per museum
  const rawArts = typeof window !== 'undefined' ? localStorage.getItem('museumArtworks') : null;
  const museumArts = rawArts ? JSON.parse(rawArts) : [];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Museums</h1>
            <p className="text-sm text-gray-500">Create, edit and remove museums.</p>
          </div>
          <div>
            <button onClick={() => { setEditing(null); setShowAdd(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded">Add Museum</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Artworks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {museums.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.website}</div>
                    </td>
                    <td className="px-4 py-3">{m.city}, {m.country}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(museumArts.filter((a:any) => a.museumName === m.name) || []).length}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${m.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-700'}`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => { setEditing(m); setShowAdd(true); }} className="px-3 py-1 border rounded text-sm">Edit</button>
                        <button onClick={() => remove(m.id)} className="px-3 py-1 text-red-600 border rounded text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdd && <AddEditMuseumModal initial={editing || undefined} onClose={() => setShowAdd(false)} onSave={save} />}
    </div>
  );
}
