"use client";

import React, { useEffect, useState } from 'react'

type User = { firstName?: string; lastName?: string; email?: string; role?: string };

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(Array.isArray(parsed) ? parsed[0] : parsed);
      } else {
        setUser({ firstName: 'Amina', lastName: 'Uwimana', email: 'amina@example.com', role: 'Artist' });
      }
    } catch (e) {
      setUser({ firstName: 'Amina', lastName: 'Uwimana', email: 'amina@example.com', role: 'Artist' });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    // navigate to login — use location since this is a simple placeholder
    window.location.href = '/login';
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <img src="/person-m-3.webp" className="w-20 h-20 rounded-full object-cover" />
          <div>
            <div className="text-xl font-semibold">{user?.firstName} {user?.lastName}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
            <div className="text-sm text-gray-500 mt-1">Role: {user?.role}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Profile</h3>
          <p className="text-sm text-gray-600">Update your profile information from account settings.</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>
    </div>
  );
}
