"use client";

import React, { useEffect, useMemo, useState } from 'react';
import sampleArtists, { type Artist } from '@/data/SampleArtists';
import sampleArtworks from '@/lib/sampleArtworks';
import sampleTransactions from '@/lib/sampleTransactions';
import ArtistViewModal from '@/components/dashboard/ArtistViewModal';
import ArtistEditModal from '@/components/dashboard/ArtistEditModal';
import AddArtistModal from '@/components/dashboard/AddArtistModal';

const CUSTOM_KEY = 'customArtists';

export default function Page() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [viewArtist, setViewArtist] = useState<Artist | null>(null);
  const [editArtist, setEditArtist] = useState<Artist | null>(null);
  const [showAddArtist, setShowAddArtist] = useState(false);

  const artistStats = useMemo(() => {
    try {
      const raw = localStorage.getItem('customArtworks');
      const custom: any[] = raw ? JSON.parse(raw) : [];

      const map = new Map<string, { count: number; total: number; sold: number }>();
      // initialize map with artists
      [...sampleArtists, ...artists].forEach(a => {
        map.set(a.id, { count: 0, total: 0, sold: 0 });
      });

      const allArtworks = [...sampleArtworks, ...custom];
      allArtworks.forEach((art: any) => {
        const stats = map.get(art.artistId) || { count: 0, total: 0, sold: 0 };
        stats.count += 1;
        stats.total += Number(art.price || 0);
        map.set(art.artistId, stats);
      });

      // sold count from transactions
      sampleTransactions.forEach(tx => {
        const art = allArtworks.find(a => a.id === tx.artworkId);
        if (art && tx.status === 'completed') {
          const stats = map.get(art.artistId) || { count: 0, total: 0, sold: 0 };
          stats.sold += 1;
          map.set(art.artistId, stats);
        }
      });

      return map;
    } catch (e) {
      return new Map();
    }
  }, [artists]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const custom: any[] = raw ? JSON.parse(raw) : [];
      const map = new Map<string, Artist>();
      [...sampleArtists, ...custom].forEach(a => map.set(a.id, a));
      // filter deleted
      const merged = Array.from(map.values()).filter(a => !(a as any).deleted);
      setArtists(merged);
    } catch (e) {
      setArtists(sampleArtists);
    }
  }, []);

  const toggleVerified = (id: string) => {
    setArtists(prev => prev.map(a => a.id === id ? { ...a, verifiedByAdmin: !a.verifiedByAdmin } : a));
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const found = list.find(i => i.id === id);
      if (found) {
        found.verifiedByAdmin = !found.verifiedByAdmin;
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
      } else {
        const base = sampleArtists.find(s => s.id === id);
        if (base) {
          const updated = { ...base, verifiedByAdmin: !base.verifiedByAdmin } as Artist;
          list.unshift(updated);
          localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveArtist = (updated: Artist) => {
    setArtists(prev => prev.map(a => a.id === updated.id ? updated : a));
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(i => i.id !== updated.id);
      filtered.unshift(updated);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  const addArtist = (payload: Partial<Artist>) => {
    try {
      const id = `artist-${Date.now()}`;
      const newArtist: Artist = {
        id,
        userId: payload.name?.toLowerCase().replace(/\s+/g, '-') || id,
        name: payload.name || 'Unnamed',
        bio: payload.bio || '',
        avatarUrl: '/avatars/default.jpg',
        profilePhotoUrl: '/profiles/default.jpg',
        website: '',
        specialization: payload.specialization || '',
        experienceYears: 0,
        country: payload.country || '',
        city: payload.city || '',
        verifiedByAdmin: false,
        socialLinks: [],
        artworks: []
      };
      setArtists(prev => [newArtist, ...prev]);
      // persist
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      list.unshift(newArtist);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteArtist = (id: string) => {
    setArtists(prev => prev.filter(a => a.id !== id));
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      // mark deleted
      list.unshift({ id, deleted: true });
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Artists</h2>
        <p className="text-sm text-gray-500 mb-4">Manage registered artists.</p>
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowAddArtist(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded">Add Artist</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artist</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artworks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {artists.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{a.name}</div>
                          <div className="text-xs text-gray-500">{a.specialization || ''}</div>
                        </td>
                        <td className="px-4 py-3">{a.city}, {a.country}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {(() => {
                            const s = artistStats.get(a.id);
                            return s ? s.count : 0;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{(() => {
                          const s = artistStats.get(a.id);
                          return s ? `$${s.total.toFixed(2)}` : '$0.00';
                        })()}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{(() => {
                          const s = artistStats.get(a.id);
                          return s ? s.sold : 0;
                        })()}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => setViewArtist(a)} className="px-3 py-1 border rounded text-sm">View</button>
                            <button onClick={() => setEditArtist(a)} className="px-3 py-1 border rounded text-sm">Edit</button>
                            <button onClick={() => toggleVerified(a.id)} className={`px-3 py-1 rounded text-sm ${a.verifiedByAdmin ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-700 border'}`}>
                              {a.verifiedByAdmin ? 'Verified' : 'Verify'}
                            </button>
                            <button onClick={() => deleteArtist(a.id)} className="px-3 py-1 text-red-600 border rounded text-sm">Delete</button>
                          </div>
                        </td>
                      </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {viewArtist && <ArtistViewModal artist={viewArtist} onClose={() => setViewArtist(null)} />}
      {editArtist && <ArtistEditModal artist={editArtist} onClose={() => setEditArtist(null)} onSave={saveArtist} />}
      {showAddArtist && <AddArtistModal onClose={() => setShowAddArtist(false)} onSave={addArtist} />}
    </div>
  );
}

