"use client";

import React from 'react';
import type { Transaction } from '@/lib/sampleTransactions';
import sampleArtworks from '@/lib/sampleArtworks';
import { CheckCircle, Clock, RefreshCw, CreditCard } from 'lucide-react';

export default function TransactionViewModal({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  if (!tx) return null;

  const art = sampleArtworks.find(a => a.id === tx.artworkId);

  function StatusBadge({ status }: { status?: Transaction['status'] }) {
    if (status === 'completed') return <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Completed</span>;
    if (status === 'pending') return <span className="inline-flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm"><Clock className="w-4 h-4" />Pending</span>;
    return <span className="inline-flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm"><RefreshCw className="w-4 h-4" />Refunded</span>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 text-gray-900 dark:text-gray-100">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Transaction {tx.id}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <img src={art?.image || '/arts/art1.jpg'} alt={tx.artworkTitle} className="w-full h-40 object-cover rounded" />
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">{tx.artworkTitle}</div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{tx.currency} {tx.amount.toFixed(2)}</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" />{tx.paymentMethod || 'card'}</div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Buyer</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{tx.buyerName}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Date</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(tx.date).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Artwork ID</div>
                <div className="text-sm font-mono text-gray-900 dark:text-gray-100">{tx.artworkId}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Status</div>
                <div className="mt-1"><StatusBadge status={tx.status} /></div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes</h4>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">No additional notes available for this transaction.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded bg-white dark:bg-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
}
