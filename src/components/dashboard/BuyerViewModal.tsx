"use client";

import React from 'react';
import Modal from '@/components/ui/Modal';

export default function BuyerViewModal({ buyer, onClose }: { buyer: any; onClose: () => void }) {
  return (
    <Modal open={!!buyer} onClose={onClose} title="Buyer Details">
      <div className="mt-2 space-y-3">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Name</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{buyer.name}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Email</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{buyer.email || '-'}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Total Spent</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">${(buyer.total || 0).toFixed(2)}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Purchases</div>
          <ul className="list-disc pl-5">
            {(buyer.purchases || []).map((p: any, i: number) => (
              <li key={i} className="text-sm text-gray-900 dark:text-gray-100">{p.title} — ${p.amount.toFixed(2)} — <span className="text-xs text-gray-500 dark:text-gray-300">{p.status}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
