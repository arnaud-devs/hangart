// app/dashboard/page.tsx
"use client";

import React from 'react';
import { useAuth } from '@/lib/authProvider';
import AdminDashboardView from '@/components/dashboard/AdminDashboardView';
import ArtistDashboardView from '@/components/dashboard/ArtistDashboardView';
import BuyerDashboardView from '@/components/dashboard/BuyerDashboardView';

export default function DashboardIndex() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div>Please log in to view your dashboard.</div>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  if (user.role === 'admin') {
    return <AdminDashboardView />;
  }

  if (user.role === 'artist') {
    return <ArtistDashboardView user={user} />;
  }

  if (user.role === 'buyer') {
    return <BuyerDashboardView user={user} />;
  }

  // Default fallback
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">Role not recognized</div>
    </div>
  );
}