"use client";

import React, { useEffect, useState } from 'react';
import sampleTransactions, { type Transaction } from '@/lib/sampleTransactions';
import BuyerViewModal from '@/components/dashboard/BuyerViewModal';
import BuyerEditModal from '@/components/dashboard/BuyerEditModal';
import AddBuyerModal from '@/components/dashboard/AddBuyerModal';

const CUSTOM_KEY = 'customBuyers';

type Buyer = {
  name: string;
  email?: string;
  total: number;
  purchases: Array<{ title: string; amount: number; status: string; date: string }>;
  lastPurchase?: string;
  deleted?: boolean;
};

export default function Page() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [viewBuyer, setViewBuyer] = useState<Buyer | null>(null);
  const [editBuyer, setEditBuyer] = useState<Buyer | null>(null);
  const [showAddBuyer, setShowAddBuyer] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const custom: Buyer[] = raw ? JSON.parse(raw) : [];

      const map = new Map<string, Buyer>();
      sampleTransactions.forEach((tx: Transaction) => {
        const existing = map.get(tx.buyerName);
        const amount = tx.amount || 0;
        const purchase = { title: tx.artworkTitle || 'Artwork', amount, status: tx.status || 'completed', date: tx.date || new Date().toISOString() };
        if (existing) {
          existing.total += amount;
          existing.purchases.push(purchase);
          existing.lastPurchase = purchase.date;
        } else {
          map.set(tx.buyerName, { name: tx.buyerName, email: (tx as any).buyerEmail, total: amount, purchases: [purchase], lastPurchase: purchase.date });
        }
      });

      // apply customs (overrides/deletions)
      custom.forEach(c => {
        if (c.deleted) {
          map.delete(c.name);
        } else {
          map.set(c.name, c);
        }
      });

      setBuyers(Array.from(map.values()));
    } catch (e) {
      console.error(e);
      setBuyers([]);
    }
  }, []);

  const saveBuyer = (b: Buyer) => {
    setBuyers(prev => prev.map(x => x.name === b.name ? b : x));
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Buyer[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(i => i.name !== b.name);
      filtered.unshift(b);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteBuyer = (name: string) => {
    setBuyers(prev => prev.filter(b => b.name !== name));
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Buyer[] = raw ? JSON.parse(raw) : [];
      list.unshift({ name, deleted: true } as any);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const addBuyer = (payload: any) => {
    try {
      const b = {
        name: payload.name,
        email: payload.email || '',
        total: 0,
        purchases: [],
        lastPurchase: undefined
      };
      setBuyers(prev => [b, ...prev]);
      const raw = localStorage.getItem(CUSTOM_KEY);
      const list: Buyer[] = raw ? JSON.parse(raw) : [];
      list.unshift(b);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Buyers</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Manage buyers and their purchases.</p>
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowAddBuyer(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Add Buyer</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Buyer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Purchase</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {buyers.map(b => (
                  <tr key={b.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{b.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">{b.purchases.length} purchases</div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{b.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">${b.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{b.lastPurchase ? new Date(b.lastPurchase).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => setViewBuyer(b)} className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">View</button>
                        <button onClick={() => setEditBuyer(b)} className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">Edit</button>
                        <button onClick={() => deleteBuyer(b.name)} className="px-3 py-1 text-red-600 dark:text-red-400 border rounded text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewBuyer && <BuyerViewModal buyer={viewBuyer} onClose={() => setViewBuyer(null)} />}
      {editBuyer && <BuyerEditModal buyer={editBuyer} onClose={() => setEditBuyer(null)} onSave={saveBuyer} />}
      {showAddBuyer && <AddBuyerModal onClose={() => setShowAddBuyer(false)} onSave={addBuyer} />}
    </div>
  );
}
