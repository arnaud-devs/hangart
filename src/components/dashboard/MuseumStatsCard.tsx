"use client";

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

type Artwork = {
  id: string;
  title: string;
  views?: number;
  price?: number;
};

export default function MuseumStatsCard({ artworks }: { artworks: Artwork[] }) {
  const byViews = useMemo(() => {
    return artworks.slice().sort((a,b)=> (b.views||0)-(a.views||0)).slice(0,6).map(a=>({ name: a.title, views: a.views||0 }));
  }, [artworks]);

  const totalValue = useMemo(()=> artworks.reduce((s,a)=> s + (a.price||0), 0), [artworks]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500">Museum Insights</div>
          <div className="text-xl font-semibold">Total Value: ${totalValue.toFixed(2)}</div>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>{artworks.length} artworks</div>
        </div>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        {byViews.length === 0 ? (
          <div className="text-sm text-gray-500 h-48 flex items-center justify-center">No data</div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={byViews} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#334155' }} />
              <Tooltip />
              <Bar dataKey="views" fill="#60a5fa" radius={[6,6,6,6]}>
                {byViews.map((_, idx) => (
                  <Cell key={`c-${idx}`} fill={["#60a5fa", "#34d399", "#f59e0b", "#ef4444", "#a78bfa"][idx % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
