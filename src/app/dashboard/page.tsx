"use client";

import React, { useEffect, useState } from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import MuseumDashboard from '@/components/dashboard/MuseumDashboard';

export default function Page() {
  const [role, setRole] = useState<string>('ARTIST');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      if (user?.role) setRole(user.role);
    } catch (e) {
      // ignore
    }
  }, []);

  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'MUSEUM') return <MuseumDashboard />;
  return <ArtistDashboard />;
}
