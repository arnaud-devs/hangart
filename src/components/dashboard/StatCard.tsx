"use client";

import React from 'react';

export default function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-gray-100">{value}</div>
      {subtitle ? <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">{subtitle}</div> : null}
    </div>
  );
}
