"use client";

import React from "react";
import Modal from "@/components/ui/Modal";

type Artwork = {
  id?: string;
  title?: string;
  image?: string;
  artist?: string;
  description?: string;
  price?: number;
};

type Props = {
  open: boolean;
  artwork?: Artwork | null;
  onClose: () => void;
};

export default function ArtworkViewModal({ open, artwork, onClose }: Props) {
  if (!artwork) return null;

  return (
    <Modal open={open} onClose={onClose} title={artwork.title || "Artwork"}>
      <div className="space-y-4">
        {artwork.image && <img src={artwork.image} alt={artwork.title} className="w-full max-h-64 object-cover rounded" />}
        <div className="text-sm text-gray-700 dark:text-gray-300">{artwork.description}</div>
        <div className="text-sm text-gray-500">Artist: {artwork.artist}</div>
        {typeof artwork.price !== 'undefined' && <div className="text-lg font-semibold">${artwork.price}</div>}
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded bg-emerald-600 text-white">Close</button>
        </div>
      </div>
    </Modal>
  );
}
