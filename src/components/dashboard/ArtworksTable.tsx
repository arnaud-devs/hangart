"use client";

import React, { useState } from 'react';
import type { Artwork } from '@/lib/sampleArtworks';
import { Eye, Edit, Trash, CheckCircle, X } from 'lucide-react';
import ArtworkViewModal from './ArtworkViewModal';
import ArtworkEditModal from './ArtworkEditModal';
import EditApprovalModal from './EditApprovalModal';

type Props = {
  artworks: Artwork[];
  onUpdate?: (a: Artwork) => void;
  onDelete?: (id: string) => void;
};

export default function ArtworksTable({ artworks, onUpdate, onDelete }: Props) {
  const [viewArtwork, setViewArtwork] = useState<Artwork | null>(null);
  const [editArtwork, setEditArtwork] = useState<Artwork | null>(null);
  const [approvalArtwork, setApprovalArtwork] = useState<Artwork | null>(null);

  const handleSave = (updated: Artwork) => {
    if (onUpdate) onUpdate(updated);
  };

  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-w-full min-h-full rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Artworks</h3>
        <div className="text-sm text-gray-500 dark:text-gray-300">{artworks.length} items</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full min-h-full divide-y divide-gray-100">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artwork</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100">
            {artworks.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={a.image} alt={a.title} className="w-16 h-12 object-cover rounded" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{a.title}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{a.currency} {Number(a.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  {a.status === 'approved' ? (
                    <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" /> Approved
                    </span>
                  ) : a.status === 'pending' ? (
                    <span className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1 rounded-full text-sm">
                      <X className="w-4 h-4" /> Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10 px-3 py-1 rounded-full text-sm">Rejected</span>
                  )}
                </td>
                <td className="px-4 py-3">{a.views}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{a.currency} {Number(a.income).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button aria-label="View" onClick={() => setViewArtwork(a)} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"><Eye className="w-4 h-4 text-gray-600 dark:text-gray-300"/></button>
                    <button aria-label="Edit" onClick={() => setEditArtwork(a)} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"><Edit className="w-4 h-4 text-gray-600 dark:text-gray-300"/></button>
                    {a.status === 'pending' && (
                      <button aria-label="Approve" onClick={() => setApprovalArtwork(a)} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-300"><CheckCircle className="w-4 h-4"/></button>
                    )}
                    <button aria-label="Delete" onClick={() => handleDelete(a.id)} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"><Trash className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewArtwork && (
        <ArtworkViewModal artwork={viewArtwork} onClose={() => setViewArtwork(null)} />
      )}

      {editArtwork && (
        <ArtworkEditModal artwork={editArtwork} onClose={() => setEditArtwork(null)} onSave={handleSave} />
      )}

      {approvalArtwork && (
        <EditApprovalModal open={!!approvalArtwork} itemId={approvalArtwork.id} currentStatus={approvalArtwork.status as any} onClose={() => setApprovalArtwork(null)} onSave={(status, note) => {
          const updated = { ...(approvalArtwork as Artwork), status};
          if (onUpdate) onUpdate(updated);
          setApprovalArtwork(null);
        }} />
      )}
    </div>
  );
}
