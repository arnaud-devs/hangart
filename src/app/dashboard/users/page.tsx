"use client";

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res: any = await adminService.getUsers();
      const list = res.results || res;
      setUsers(list as any[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerify = async (u: any) => {
    try {
      if (u.role === 'artist') {
        // toggle artist verified flag
        const newVal = !u.artist_profile?.verified_by_admin;
        await adminService.verifyArtist(u.id, newVal);
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, artist_profile: { ...(x.artist_profile||{}), verified_by_admin: newVal }, is_verified: newVal } : x));
      } else {
        // toggle user.is_verified via admin user update
        const newVal = !u.is_verified;
        await adminService.updateUser(u.id, { is_verified: newVal });
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_verified: newVal } : x));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update verification');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">Access denied — admin only.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Users</h2>
            <p className="text-sm text-gray-500">List of registered users. Admins can verify artists or mark users verified.</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {u.role === 'artist' ? (u.artist_profile?.verified_by_admin ? 'Verified' : 'Pending') : (u.is_verified ? 'Verified' : 'Pending')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => toggleVerify(u)} className="text-sm px-3 py-1 rounded bg-emerald-600 text-white">{(u.role === 'artist' ? (u.artist_profile?.verified_by_admin ? 'Unverify' : 'Verify') : (u.is_verified ? 'Unverify' : 'Verify'))}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
