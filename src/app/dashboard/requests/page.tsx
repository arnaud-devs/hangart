"use client";

import React, { useEffect, useState } from 'react';
import sampleRequests, { type MuseumRequest } from '@/data/sampleMuseumRequests';
import sampleArtworks from '@/lib/sampleArtworks';

const STORAGE_KEY = 'museumRequests';

export default function Page() {
  const [requests, setRequests] = useState<MuseumRequest[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: MuseumRequest[] = raw ? JSON.parse(raw) : [];
      const map = new Map<string, MuseumRequest>();
      [...list, ...sampleRequests].forEach(r => map.set(r.id, r));
      setRequests(Array.from(map.values()));
    } catch (e) {
      setRequests(sampleRequests);
    }
  }, []);

  const updateStatus = (id: string, status: MuseumRequest['status']) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: MuseumRequest[] = raw ? JSON.parse(raw) : [];
      const updated = requests.map(r => r.id === id ? { ...r, status } : r);
      setRequests(updated);
      const filtered = list.filter(i => i.id !== id);
      const item = updated.find(u => u.id === id);
      if (item) filtered.unshift(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) { console.error(e); }
  };

  const remove = (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const filteredCustom = list.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCustom));
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-sm text-gray-500">Loan & acquisition requests from external organisations.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y">
            {requests.map(r => (
              <div key={r.id} className="p-4 flex items-start justify-between">
                <div>
                  <div className="font-semibold">{r.artworkTitle || r.artworkId}</div>
                  <div className="text-xs text-gray-500">From: {r.requesterName} {r.requesterOrg ? `• ${r.requesterOrg}` : ''}</div>
                  <div className="text-sm text-gray-700 mt-2">{r.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{r.status}</span>
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(r.id, 'approved')} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Approve</button>
                      <button onClick={() => updateStatus(r.id, 'rejected')} className="px-3 py-1 bg-rose-600 text-white rounded text-sm">Reject</button>
                    </>
                  )}
                  <button onClick={() => remove(r.id)} className="px-3 py-1 border rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
