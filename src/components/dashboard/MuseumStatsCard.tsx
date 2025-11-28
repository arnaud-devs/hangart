"use client";

import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function MuseumStatsCard({ artworks }: { artworks: any[] }) {
  const totalValue = useMemo(() => {
    return artworks.reduce((s, a) => s + (a.price || a.value || 0), 0);
  }, [artworks]);

  const byViews = useMemo(() => {
    const arr = artworks.map(a => ({ name: a.title || a.name || 'Artwork', views: a.views || 0 }));
    return arr.sort((a, b) => b.views - a.views).slice(0, 5);
  }, [artworks]);

  const COLORS = ['#60a5fa', '#34d399', '#f59e0b', '#ef4444', '#a78bfa'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Museum Insights</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">Total Value: ${totalValue.toFixed(2)}</div>
        </div>
        <div className="text-right text-sm text-gray-500 dark:text-gray-300">
          <div className="text-gray-900 dark:text-gray-100">{artworks.length} artworks</div>
        </div>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        {byViews.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-300 h-48 flex items-center justify-center">No data</div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={byViews} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip />
              <Bar dataKey="views" fill="#60a5fa" radius={[6, 6, 6, 6]}>
                {byViews.map((_, idx: number) => (
                  <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
