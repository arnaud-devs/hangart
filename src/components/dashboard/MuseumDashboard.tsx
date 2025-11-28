"use client";

import React, { useEffect, useState } from 'react';
import sampleArtworks from '@/lib/sampleArtworks';
import MuseumStatsCard from '@/components/dashboard/MuseumStatsCard';
import MuseumCharts from '@/components/dashboard/MuseumCharts';

export default function MuseumDashboard() {
  const [arts, setArts] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('museumArtworks');
    const custom = raw ? JSON.parse(raw) : [];
    const all = [...sampleArtworks.filter(a => a.forMuseum), ...custom];
    setArts(all);
  }, []);

  // compute stats
  const totalCollection = arts.length;
  const totalViewers = arts.reduce((s,a)=> s + (a.views || 0), 0);
  const totalRevenue = arts.reduce((s,a)=> s + (a.income || 0), 0);

  // derive sample collections from museum artworks grouped by museumId
  const collections = (() => {
    const byCollection: Record<string, any> = {};
    arts.forEach(a => {
      const key = a.museumId || 'collection';
      if (!byCollection[key]) byCollection[key] = { title: a.museumName || key, totalValue: 0, views: 0, items: [] };
      byCollection[key].items.push(a);
      byCollection[key].totalValue += (a.price || 0);
      byCollection[key].views += (a.views || 0);
    });
    return Object.values(byCollection);
  })();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Museum Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your museum collections and performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-300">Total Collection</div>
              <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-gray-100">{totalCollection}</div>
            </div>
          </div>
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-300">Total Viewers</div>
              <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-gray-100">{totalViewers}</div>
            </div>
          </div>
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-300">Total Revenues</div>
              <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-gray-100">${totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <MuseumStatsCard artworks={arts} />
        </div>

        <div>
          <MuseumCharts collections={collections} />
        </div>
      </div>
    </div>
  );
}
