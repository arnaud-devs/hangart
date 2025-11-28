"use client";

import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

export default function MuseumCharts({ collections }: { collections: any[] }) {
  const barData = useMemo(() => {
    return collections.map(c => ({ name: c.title, views: c.views || 0 }));
  }, [collections]);

  const pieData = useMemo(() => {
    return collections.map(c => ({ name: c.title, value: c.totalValue || 0 }));
  }, [collections]);

  const COLORS = ['#2563eb', '#60a5fa', '#34d399', '#f59e0b', '#ef4444', '#a78bfa'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-2">Collection Views</div>
        <div style={{ width: '100%', height: 260 }}>
          {barData.length === 0 ? (
            <div className="text-sm text-gray-500 h-48 flex items-center justify-center">No data</div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="views" fill="#60a5fa">
                  {barData.map((_, idx) => <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-2">Collection Value Breakdown</div>
        <div style={{ width: '100%', height: 260 }}>
          {pieData.length === 0 ? (
            <div className="text-sm text-gray-500 h-48 flex items-center justify-center">No data</div>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4} label>
                  {pieData.map((_, idx) => <Cell key={`p-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
