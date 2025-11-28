"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import type { Artist } from '@/data/SampleArtists';

export default function ArtistViewModal({ artist, onClose }: { artist: Artist | null; onClose: () => void }) {
  if (!artist) return null;

  return (
    <Modal open={!!artist} onClose={onClose} title={artist.name}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img src={artist.avatarUrl || '/avatars/default.jpg'} alt={artist.name} className="w-20 h-20 rounded-full object-cover" />
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{artist.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{artist.city}, {artist.country}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Biography</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{artist.bio || 'No biography.'}</p>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-emerald-600 text-white rounded">Close</button>
        </div>
      </div>
    </Modal>
  );
}

