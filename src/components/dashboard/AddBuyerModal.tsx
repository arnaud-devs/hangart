"use client";

import React, { useState } from 'react';

export default function AddBuyerModal({ onClose, onSave }: { onClose: () => void; onSave: (b: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, total: 0, purchases: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <h3 className="text-lg font-semibold mb-4">Add Buyer</h3>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" type="email" />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Add</button>
        </div>
      </form>
    </div>
  );
}
