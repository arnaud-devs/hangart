"use client";

import React from 'react';
import type { Artist } from '@/data/SampleArtists';

export default function ArtistViewModal({ artist, onClose }: { artist: Artist; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Artist Details</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="flex items-center gap-4">
            <img src={(artist as any).avatar || '/person-m-3.webp'} alt={artist.name} className="w-20 h-20 rounded-full object-cover" />
            <div>
              <div className="text-xl font-semibold">{artist.name}</div>
              <div className="text-sm text-gray-500">{artist.city}, {artist.country}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Specialization</div>
            <div className="font-medium">{artist.specialization}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Bio</div>
            <div className="text-sm">{artist.bio || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
