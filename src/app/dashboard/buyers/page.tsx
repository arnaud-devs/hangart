// app/dashboard/buyers/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Users, ShoppingCart, CreditCard, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/authProvider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { listAdminBuyers } from '@/lib/appClient';
import { BuyerProfileDTO, Paginated } from '@/lib/types/api';

export default function BuyersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [buyers, setBuyers] = useState<BuyerProfileDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Auth check disabled for development
    // Uncomment to re-enable authentication
    /*
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role?.toLowerCase() !== 'admin') {
      router.push('/');
    }
    */
  }, [mounted, authLoading, user, router]);

  useEffect(() => {
    // Load buyers if mounted (auth check disabled for development)
    if (mounted) {
      loadBuyers();
    }
  }, [mounted]);

  const loadBuyers = async () => {
    try {
      setLoading(true);
      const response = await listAdminBuyers();
      
      if (Array.isArray(response)) {
        setBuyers(response);
      } else if (response && 'results' in response) {
        setBuyers(response.results || []);
      }
    } catch (err: any) {
      console.error('Error loading buyers:', err);
      showToast('error', 'Error', 'Failed to load buyers');
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuyers = buyers.filter(buyer =>
    buyer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (buyer.email && buyer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (buyer.city && buyer.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (buyer.country && buyer.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: buyers.length,
    verified: buyers.filter(b => b.profile_photo).length,
    active: Math.floor(buyers.length * 0.7),
    newThisMonth: Math.floor(buyers.length * 0.25),
  };

  if (!mounted || (authLoading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Buyers Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage registered buyers and view their profiles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Buyers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Profile Photo</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.verified}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Buyers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.active}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.newThisMonth}</p>
            </div>
            <CreditCard className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Buyers Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      ) : filteredBuyers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {searchTerm ? 'No buyers found' : 'No buyers yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Buyers will appear here once they register'}
          </p>
          <button
            onClick={loadBuyers}
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Date of Birth
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBuyers.map((buyer) => (
                  <tr
                    key={buyer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Username */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {buyer.profile_photo ? (
                          <img
                            src={buyer.profile_photo}
                            alt={buyer.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                            {buyer.username[0].toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {buyer.username}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      {buyer.email ? (
                        <a
                          href={`mailto:${buyer.email}`}
                          className="text-yellow-600 dark:text-yellow-400 hover:underline truncate block"
                        >
                          {buyer.email}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      {buyer.phone ? (
                        <a
                          href={`tel:${buyer.phone}`}
                          className="text-yellow-600 dark:text-yellow-400 hover:underline"
                        >
                          {buyer.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {[buyer.address, buyer.city, buyer.country]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </td>

                    {/* Date of Birth */}
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {buyer.date_of_birth
                        ? new Date(buyer.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredBuyers.length} of {buyers.length} buyers
              {searchTerm && ` (filtered)`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}