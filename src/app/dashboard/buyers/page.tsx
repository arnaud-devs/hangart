// app/dashboard/buyers/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Users, ShoppingCart, CreditCard, TrendingUp } from 'lucide-react';
import { adminService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/dashboard/DataTable';

interface Buyer {
  id: number;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    is_verified: boolean;
  };
  user_id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_photo?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const { user } = useAuth();

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      setLoading(true);
      // Backend does not expose a buyers listing endpoint. Leave buyers empty for now.
      setBuyers([]);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load buyers');
      console.error('Error loading buyers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: buyers.length,
    verified: buyers.filter(b => b.user?.is_verified).length,
    unverified: buyers.filter(b => !b.user?.is_verified).length,
    newThisMonth: Math.floor(buyers.length * 0.2), // Mock trend
  };

  // Filter buyers
  const filteredBuyers = buyers.filter(b => {
    if (verificationFilter === 'verified') return b.user?.is_verified;
    if (verificationFilter === 'unverified') return !b.user?.is_verified;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Buyer',
      sortable: true,
      render: (_: any, row: Buyer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {(row.user?.first_name || row.first_name || row.username || 'B')[0].toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {row.user?.first_name || row.first_name || ''} {row.user?.last_name || row.last_name || ''}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              @{row.user?.username || row.username || 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (_: any, row: Buyer) => (
        <span className="text-gray-900 dark:text-gray-100">
          {row.user?.email || row.email || 'N/A'}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: any) => (
        <span className="text-gray-900 dark:text-gray-100">
          {value || 'Not provided'}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (_: any, row: Buyer) => (
        <span className="text-gray-900 dark:text-gray-100">
          {row.city && row.country ? `${row.city}, ${row.country}` : row.city || row.country || 'N/A'}
        </span>
      ),
    },
    {
      key: 'is_verified',
      label: 'Verification',
      sortable: true,
      render: (value: boolean) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}
        >
          {value ? '✓ Verified' : 'Unverified'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buyers Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage registered buyers and their purchase history
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Buyers"
          value={stats.total}
          icon={Users}
          color="blue"
          description="All registered buyers"
        />
        <StatsCard
          title="Verified Buyers"
          value={stats.verified}
          icon={ShoppingCart}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Unverified"
          value={stats.unverified}
          icon={Users}
          color="orange"
          description="Awaiting verification"
        />
        <StatsCard
          title="New This Month"
          value={stats.newThisMonth}
          icon={TrendingUp}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {buyers.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Buyers Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The backend doesn't expose a buyers listing endpoint yet. Buyers register through the public signup form.
          </p>
          <button
            onClick={loadBuyers}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Data Table */}
      {buyers.length > 0 && (
        <DataTable
          data={filteredBuyers}
          columns={columns}
          searchPlaceholder="Search buyers by name, email, or location..."
          loading={loading}
          itemsPerPage={10}
          filters={
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Status
                </label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Buyers</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}