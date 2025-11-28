"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';

export default function AddBuyerModal({ onClose, onSave }: { onClose: () => void; onSave: (b: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, total: 0, purchases: [] });
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title="Add Buyer">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" type="email" />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded bg-white dark:bg-gray-700">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Add</button>
        </div>
      </form>
    </Modal>
  );
}
