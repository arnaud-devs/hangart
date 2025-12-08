"use client";

import React, { useState } from 'react';

type Props = {
  artist: any;
  onClose: () => void;
  onConfirm: (verified: boolean, adminComment?: string) => Promise<void> | void;
};

export default function VerifyArtistModal({ artist, onClose, onConfirm }: Props) {
  const [verified, setVerified] = useState<boolean>(!!artist?.verified_by_admin);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(verified, comment);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Verify Artist</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Toggle verification status for <strong>{artist?.user?.username || artist?.user?.first_name || 'artist'}</strong>.
        </p>

        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          <span className="text-sm text-gray-700 dark:text-gray-300">Verified</span>
        </label>

        <label className="block mb-4">
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Admin comment (optional)</div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-sm"
            rows={3}
          />
        </label>

        <div className="flex justify-end items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
