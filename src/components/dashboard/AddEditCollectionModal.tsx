"use client";

import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';

type Collection = {
  id?: string;
  title?: string;
  description?: string;
  artworks?: string[];
};

export default function AddEditCollectionModal({ initial, open = true, onClose, onSave }: { initial?: Collection; open?: boolean; onClose: () => void; onSave: (c: Partial<Collection>) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
    }
  }, [initial]);

  function submit() {
    const payload: Partial<Collection> = { id: initial?.id, title, description, artworks: initial?.artworks || [] };
    onSave(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Collection' : 'Add Collection'}>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border bg-white dark:bg-gray-700">Cancel</button>
          <button onClick={submit} className="px-3 py-1 rounded bg-emerald-600 text-white">Save</button>
        </div>
      </div>
    </Modal>
  );
}
