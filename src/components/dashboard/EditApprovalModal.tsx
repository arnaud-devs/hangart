"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  itemId?: string;
  currentStatus?: 'pending' | 'approved' | 'rejected';
  onClose: () => void;
  onSave: (status: 'pending' | 'approved' | 'rejected', note?: string) => void;
};

export default function EditApprovalModal({ open, itemId, currentStatus = 'pending', onClose, onSave }: Props) {
  const [status, setStatus] = useState<typeof currentStatus>(currentStatus);
  const [note, setNote] = useState('');

  React.useEffect(() => {
    setStatus(currentStatus);
    setNote('');
  }, [currentStatus, open]);

  function submit() {
    onSave(status, note || undefined);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Edit Approval${itemId ? `: ${itemId}` : ''}`}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
          <div className="mt-2 flex gap-3">
            <label className={`px-3 py-1 rounded cursor-pointer ${status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
              <input type="radio" name="status" checked={status === 'approved'} onChange={() => setStatus('approved')} className="hidden" /> Approved
            </label>
            <label className={`px-3 py-1 rounded cursor-pointer ${status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
              <input type="radio" name="status" checked={status === 'pending'} onChange={() => setStatus('pending')} className="hidden" /> Pending
            </label>
            <label className={`px-3 py-1 rounded cursor-pointer ${status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
              <input type="radio" name="status" checked={status === 'rejected'} onChange={() => setStatus('rejected')} className="hidden" /> Rejected
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin note (optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} className="mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded bg-white dark:bg-gray-700">Cancel</button>
          <button onClick={submit} className="px-3 py-1 bg-emerald-600 text-white rounded">Save</button>
        </div>
      </div>
    </Modal>
  );
}
