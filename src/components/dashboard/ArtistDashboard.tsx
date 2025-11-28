"use client";

import React, { useEffect, useState } from 'react';
import sampleArtworks from '@/lib/sampleArtworks';
import sampleTransactions from '@/lib/sampleTransactions';

export default function ArtistDashboard() {
  const [artistId, setArtistId] = useState<string>('artist-01');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      if (user?.id) setArtistId(user.id);
    } catch (e) {
      // ignore
    }
  }, []);

  const rawCustom = typeof window !== 'undefined' ? localStorage.getItem('customArtworks') : null;
  const custom = rawCustom ? JSON.parse(rawCustom) : [];
  const allArtworks = [...sampleArtworks, ...custom];

  const artistArtworks = allArtworks.filter(a => a.artistId === artistId);
  const total = artistArtworks.length;
  const approved = artistArtworks.filter(a => a.status === 'approved').length;
  const pending = artistArtworks.filter(a => a.status === 'pending').length;
  const income = artistArtworks.reduce((s, a) => s + (a.income || 0), 0);

  const topByViews = [...artistArtworks].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);

  const pieData = [
    { label: 'Approved', value: artistArtworks.filter(a => a.status === 'approved').length, color: '#10b981' },
    { label: 'Pending', value: artistArtworks.filter(a => a.status === 'pending').length, color: '#f59e0b' },
    { label: 'Rejected', value: artistArtworks.filter(a => a.status === 'rejected').length, color: '#ef4444' },
  ];
  const pieTotal = pieData.reduce((s, p) => s + p.value, 0) || 1;

  const views = artistArtworks.reduce((s, a) => s + (a.views || 0), 0);

  const txs = sampleTransactions.filter(t => {
    const art = allArtworks.find(a => a.id === t.artworkId);
    return art?.artistId === artistId;
  });
  const txCompleted = txs.filter(t => t.status === 'completed').length;
  const txPending = txs.filter(t => t.status === 'pending').length;
  const txRefunded = txs.filter(t => t.status === 'refunded').length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-500">Overview of your artworks performance and sales.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-md">
              <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Artworks</div>
              <div className="text-2xl font-semibold">{total}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-md">
              <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 12l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Approved</div>
              <div className="text-2xl font-semibold text-emerald-600">{approved}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-semibold text-yellow-600">{pending}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-md">
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1v22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Income</div>
              <div className="text-2xl font-semibold">${income.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Views by Artwork</h3>
            {topByViews.length === 0 ? (
              <div className="text-sm text-gray-500">No artworks to show.</div>
            ) : (
              <div className="space-y-3">
                {topByViews.map((a) => {
                  const max = topByViews[0].views || 1;
                  const width = Math.round((a.views / max) * 100);
                  return (
                    <div key={a.id} className="flex items-center gap-4">
                      <div className="w-40 text-sm font-medium">{a.title}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div style={{ width: `${width}%` }} className="h-3 bg-emerald-500" />
                      </div>
                      <div className="w-16 text-right text-sm text-gray-600">{a.views}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Status Distribution</h3>

            <div className="flex items-center gap-4">
              {/* Pie chart using SVG circle segments via stroke-dasharray */}
              <svg width="120" height="120" viewBox="0 0 42 42" className="shrink-0">
                <defs>
                  <linearGradient id="g1" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <g transform="translate(21,21)">
                  {(() => {
                    let cumulative = 0;
                    return pieData.map((d, idx) => {
                      const value = d.value;
                      const portion = value / pieTotal;
                      const dash = portion * 100;
                      const strokeDasharray = `${dash} ${100 - dash}`;
                      const rotate = cumulative * 3.6; // degrees
                      cumulative += dash;
                      return (
                        <circle
                          key={d.label}
                          r="15.9"
                          cx="0"
                          cy="0"
                          fill="transparent"
                          stroke={d.color}
                          strokeWidth="8"
                          strokeDasharray={strokeDasharray}
                          transform={`rotate(${rotate})`}
                          strokeLinecap="butt"
                        />
                      );
                    });
                  })()}
                </g>
              </svg>

              <div className="flex-1">
                {pieData.map((p) => (
                  <div key={p.label} className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ background: p.color }} className="w-3 h-3 rounded-full inline-block" />
                      <span className="text-gray-700">{p.label}</span>
                    </div>
                    <div className="text-gray-600">{((p.value / pieTotal) * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-md">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 17h5l-1.405-1.405" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Views</div>
              <div className="text-xl font-semibold">{views}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-md">
              <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Transactions</div>
              <div className="text-xl font-semibold">{txs.length}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-md">
                    <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 12l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Completed</div>
                    <div className="text-lg font-semibold">{txCompleted}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{((txCompleted / (txs.length || 1)) * 100).toFixed(0)}%</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-md">
                    <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="text-lg font-semibold">{txPending}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{((txPending / (txs.length || 1)) * 100).toFixed(0)}%</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-md">
                    <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l1.5 4.5L18 8l-4 2.5L14.5 17 12 13.5 9.5 17 10 10.5 6 8l4.5-1.5L12 2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Refunded</div>
                    <div className="text-lg font-semibold">{txRefunded}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{((txRefunded / (txs.length || 1)) * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

