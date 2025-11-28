"use client";

import React from 'react';
import sampleArtworks from '@/lib/sampleArtworks';
import type { Artwork } from '@/lib/sampleArtworks';
import sampleTransactions from '@/lib/sampleTransactions';
import sampleArtists from '@/data/SampleArtists';
import sampleMuseums from '@/data/SampleMuseums';

export default function AdminDashboard() {
  const rawCustom = typeof window !== 'undefined' ? localStorage.getItem('customArtworks') : null;
  const custom: Artwork[] = rawCustom ? JSON.parse(rawCustom) : [];
  const allArtworks = [...sampleArtworks, ...custom];

  const totalValue = allArtworks.reduce((s, a) => s + (a.price || 0), 0);
  const pendingValue = allArtworks.filter(a => a.status === 'pending').reduce((s, a) => s + (a.price || 0), 0);
  const rejectedValue = allArtworks.filter(a => a.status === 'rejected').reduce((s, a) => s + (a.price || 0), 0);
  const approvedValue = allArtworks.filter(a => a.status === 'approved').reduce((s, a) => s + (a.price || 0), 0);

  const topByPrice = [...allArtworks].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 8);

  const counts = {
    approved: allArtworks.filter(a => a.status === 'approved').length,
    pending: allArtworks.filter(a => a.status === 'pending').length,
    rejected: allArtworks.filter(a => a.status === 'rejected').length,
  };

  const pieDataAdmin = [
    { label: 'Approved', value: counts.approved, color: '#10b981' },
    { label: 'Pending', value: counts.pending, color: '#f59e0b' },
    { label: 'Rejected', value: counts.rejected, color: '#ef4444' },
  ];

  const pieTotalAdmin = pieDataAdmin.reduce((s, p) => s + p.value, 0) || 1;

  const pendingApprovalsCount = counts.pending;
  const totalArtworksCount = allArtworks.length;
  const rawCustomArtists = typeof window !== 'undefined' ? localStorage.getItem('customArtists') : null;
  const customArtists = rawCustomArtists ? JSON.parse(rawCustomArtists) : [];
  const artistIds = new Set<string>();
  [...sampleArtists, ...customArtists].forEach((a: any) => artistIds.add(a.id));
  const artistsCount = artistIds.size;

  const buyerNames = new Set<string>(sampleTransactions.map(t => t.buyerName));
  const rawCustomBuyers = typeof window !== 'undefined' ? localStorage.getItem('customBuyers') : null;
  const customBuyers = rawCustomBuyers ? JSON.parse(rawCustomBuyers) : [];
  if (Array.isArray(customBuyers)) {
    customBuyers.forEach((b: any) => {
      if (b.name) buyerNames.add(b.name);
      if (b.buyerName) buyerNames.add(b.buyerName);
    });
  }
  const buyersCount = buyerNames.size;

  const rawCustomMuseums = typeof window !== 'undefined' ? localStorage.getItem('customMuseums') : null;
  const customMuseums = rawCustomMuseums ? JSON.parse(rawCustomMuseums) : [];
  const museumIds = new Set<string>();
  [...sampleMuseums, ...customMuseums].forEach((m: any) => museumIds.add(m.id));
  const museumsCount = museumIds.size;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">High-level marketplace financial overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Artworks Value</div>
            <div className="text-2xl font-semibold">${totalValue.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Pending Artworks Value</div>
            <div className="text-2xl font-semibold text-yellow-600">${pendingValue.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Rejected Artworks Value</div>
            <div className="text-2xl font-semibold text-red-600">${rejectedValue.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Approved Artworks Value</div>
            <div className="text-2xl font-semibold text-emerald-600">${approvedValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Approvals</div>
            <div className="text-2xl font-semibold">{pendingApprovalsCount}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Artists</div>
            <div className="text-2xl font-semibold">{artistsCount}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Artworks</div>
            <div className="text-2xl font-semibold">{totalArtworksCount}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Buyers</div>
            <div className="text-2xl font-semibold">{buyersCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Museums Count</div>
            <div className="text-2xl font-semibold">{museumsCount}</div>
            <div className="mt-2"><a href="/dashboard/museums" className="text-sm text-emerald-600 underline">Manage Museums</a></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Top Artworks by Price</h3>
            <div className="space-y-3">
              {topByPrice.map((a) => {
                const max = topByPrice[0]?.price || 1;
                const width = Math.round(((a.price || 0) / max) * 100);
                return (
                  <div key={a.id} className="flex items-center gap-4">
                    <div className="w-40 text-sm font-medium">{a.title} — <span className="text-xs text-gray-500">{a.artistName}</span></div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div style={{ width: `${width}%` }} className="h-3 bg-emerald-500" />
                    </div>
                    <div className="w-32 text-right text-sm text-gray-600">${(a.price || 0).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Status Distribution</h3>
            <div className="flex items-center gap-4">
              <svg width="120" height="120" viewBox="0 0 42 42" className="shrink-0">
                <g transform="translate(21,21)">
                  {(() => {
                    let cumulative = 0;
                    return pieDataAdmin.map((d) => {
                      const portion = d.value / pieTotalAdmin;
                      const dash = portion * 100;
                      const strokeDasharray = `${dash} ${100 - dash}`;
                      const rotate = cumulative * 3.6;
                      cumulative += dash;
                      return (
                        <circle key={d.label} r="15.9" cx="0" cy="0" fill="transparent" stroke={d.color} strokeWidth="8" strokeDasharray={strokeDasharray} transform={`rotate(${rotate})`} strokeLinecap="butt" />
                      );
                    });
                  })()}
                </g>
              </svg>

              <div className="flex-1">
                {pieDataAdmin.map((p) => (
                  <div key={p.label} className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ background: p.color }} className="w-3 h-3 rounded-full inline-block" />
                      <span className="text-gray-700">{p.label}</span>
                    </div>
                    <div className="text-gray-600">{((p.value / pieTotalAdmin) * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
