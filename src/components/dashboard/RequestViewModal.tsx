"use client";

import React from 'react';
import Modal from '@/components/ui/Modal';

type Request = {
  id: string;
  museumId?: string;
  requesterName?: string;
  message?: string;
  status?: 'open' | 'approved' | 'rejected';
  createdAt?: string;
};

export default function RequestViewModal({ req, onClose, onUpdate }: { req: Request | null; onClose: () => void; onUpdate?: (r: Request) => void }) {
  if (!req) return null;

  function approve() {
    onUpdate?.(({ ...req, status: 'approved' } as Request));
    onClose();
  }
  function reject() {
    onUpdate?.(({ ...req, status: 'rejected' } as Request));
    onClose();
  }

  return (
    <Modal open={!!req} onClose={onClose} title={`Request from ${req.requesterName || 'Guest'}`}>
      <div className="space-y-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">{req.message}</div>
        <div className="text-xs text-gray-500">Submitted: {req.createdAt ? new Date(req.createdAt).toLocaleString() : ''}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border bg-white dark:bg-gray-700">Close</button>
          <button onClick={reject} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
          <button onClick={approve} className="px-3 py-1 rounded bg-emerald-600 text-white">Approve</button>
        </div>
      </div>
    </Modal>
  );
}
