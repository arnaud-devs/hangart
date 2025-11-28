"use client";

import React from 'react';

export default function BuyerViewModal({ buyer, onClose }: { buyer: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Buyer Details</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{buyer.name}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-medium">{buyer.email || '-'}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Total Spent</div>
            <div className="font-medium">${(buyer.total || 0).toFixed(2)}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Purchases</div>
            <ul className="list-disc pl-5">
              {(buyer.purchases || []).map((p: any, i: number) => (
                <li key={i} className="text-sm">{p.title} — ${p.amount.toFixed(2)} — <span className="text-xs text-gray-500">{p.status}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
