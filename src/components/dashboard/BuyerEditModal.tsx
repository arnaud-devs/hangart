"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

export default function BuyerEditModal({ buyer, onClose, onSave }: { buyer: any; onClose: () => void; onSave: (b: any) => void }) {
  const [name, setName] = useState(buyer.name || '');
  const [email, setEmail] = useState(buyer.email || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...buyer, name, email });
    onClose();
  };

  return (
    <Modal open={!!buyer} onClose={onClose} title="Edit Buyer">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded bg-white dark:bg-gray-700">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </form>
    </Modal>
  );
}
