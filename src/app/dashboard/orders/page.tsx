"use client";

import React from 'react';
import sampleOrders from '@/lib/sampleOrders';
import sampleArtworks from '@/lib/sampleArtworks';

export default function OrdersPage() {
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    user = null;
  }

  const rawCustom = typeof window !== 'undefined' ? localStorage.getItem('customOrders') : null;
  const custom = rawCustom ? JSON.parse(rawCustom) : [];
  const all = [...sampleOrders, ...custom];

  const myOrders = user && user.role === 'BUYER' ? all.filter((o: any) => o.buyerId === user.id) : all;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-sm text-gray-500">Recent purchases and order status.</p>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-sm text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((o: any) => {
              const art = sampleArtworks.find(a => a.id === o.artworkId);
              return (
                <div key={o.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={art?.image || '/arts/art1.jpg'} alt={o.artworkTitle} className="w-20 h-14 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{o.artworkTitle}</div>
                      <div className="text-xs text-gray-500">{new Date(o.date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">${o.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{o.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
