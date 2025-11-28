"use client";

import React, { useEffect, useState } from 'react'
import sampleTransactions, { type Transaction } from '@/lib/sampleTransactions'
import sampleArtworks from '@/lib/sampleArtworks'
import { CheckCircle, Clock, RefreshCw, CreditCard, Eye } from 'lucide-react'
import TransactionViewModal from '@/components/dashboard/TransactionViewModal'

export default function Page() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [viewTx, setViewTx] = useState<Transaction | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      const currentArtistId = user?.id || 'artist-01';

      const filtered = sampleTransactions.filter(tx => {
        const art = sampleArtworks.find(a => a.id === tx.artworkId);
        return art?.artistId === currentArtistId;
      });
      setTxs(filtered);
    } catch (e) {
      setTxs([]);
    }
  }, []);

  function StatusBadge({ status }: { status?: Transaction['status'] }) {
    if (status === 'completed') return <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Completed</span>;
    if (status === 'pending') return <span className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900 px-3 py-1 rounded-full text-sm"><Clock className="w-4 h-4" />Pending</span>;
    return <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900 px-3 py-1 rounded-full text-sm"><RefreshCw className="w-4 h-4" />Refunded</span>;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Transactions</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700" aria-label="Transactions table">
              <caption className="sr-only">List of transactions for your artworks</caption>
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TX ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Artwork</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Buyer</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {txs.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500 dark:text-gray-300">No transactions yet.</td></tr>
                )}
                {txs.map(tx => {
                  const art = sampleArtworks.find(a => a.id === tx.artworkId);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 font-mono">{tx.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200">{new Date(tx.date).toLocaleString()}</td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img src={art?.image || '/arts/art1.jpg'} alt={tx.artworkTitle} className="w-12 h-8 object-cover rounded" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{tx.artworkTitle}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">by {art?.artistName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{tx.buyerName}</td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">{tx.currency} {tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-300" />{tx.paymentMethod || 'card'}</td>
                      <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <button aria-label="View transaction" onClick={() => setViewTx(tx)} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"><Eye className="w-4 h-4 text-gray-600 dark:text-gray-200"/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {viewTx && (
        <TransactionViewModal tx={viewTx} onClose={() => setViewTx(null)} />
      )}
    </div>
  );
}
