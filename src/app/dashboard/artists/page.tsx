"use client";

import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, TrendingUp, Shield } from 'lucide-react';
import { adminService, artistService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/dashboard/DataTable';
import VerifyArtistModal from '@/components/dashboard/VerifyArtistModal';

interface Artist {
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
  bio?: string;
  profile_photo?: string;
  specialization?: string;
  experience_years?: number;
  country?: string;
  city?: string;
  verified_by_admin?: boolean;
  website?: string;
  instagram?: string;
  facebook?: string;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyTarget, setVerifyTarget] = useState<Artist | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const { user } = useAuth();

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const response = await artistService.listArtists();
      const artistsData = response.results || response || [];
      setArtists(artistsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load artists');
      console.error('Error loading artists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (artistId: number, verified: boolean) => {
    try {
      await adminService.verifyArtist(artistId, verified);
      await loadArtists();
      setVerifyTarget(null);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify artist');
    }
  };

  // Calculate stats
  const stats = {
    total: artists.length,
    verified: artists.filter(a => a.verified_by_admin).length,
    pending: artists.filter(a => !a.verified_by_admin).length,
    newThisMonth: Math.floor(artists.length * 0.15), // Mock trend
  };

  // Filter artists
  const filteredArtists = artists.filter(a => {
    if (statusFilter === 'verified') return a.verified_by_admin;
    if (statusFilter === 'pending') return !a.verified_by_admin;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Artist',
      sortable: true,
      render: (_: any, row: Artist) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold">
            {(row.user?.first_name || row.first_name || row.username || 'A')[0].toUpperCase()}
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
      render: (_: any, row: Artist) => (
        <span className="text-gray-900 dark:text-gray-100">
          {row.user?.email || row.email || 'N/A'}
        </span>
      ),
    },
    {
      key: 'specialization',
      label: 'Specialization',
      sortable: true,
      render: (value: any) => (
        <span className="text-gray-900 dark:text-gray-100">
          {value || 'Not specified'}
        </span>
      ),
    },
    {
      key: 'experience_years',
      label: 'Experience',
      sortable: true,
      render: (value: any) => (
        <span className="text-gray-900 dark:text-gray-100">
          {value || 0} years
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (_: any, row: Artist) => (
        <span className="text-gray-900 dark:text-gray-100">
          {row.city && row.country ? `${row.city}, ${row.country}` : row.country || row.city || 'N/A'}
        </span>
      ),
    },
    {
      key: 'verified_by_admin',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        value ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <XCircle className="w-3 h-3" />
            Pending
          </span>
        )
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Artists Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and verify artist profiles
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Artists"
          value={stats.total}
          icon={Users}
          color="blue"
          description="All registered artists"
        />
        <StatsCard
          title="Verified Artists"
          value={stats.verified}
          icon={CheckCircle}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Verification"
          value={stats.pending}
          icon={Shield}
          color="orange"
          description="Awaiting admin approval"
        />
        <StatsCard
          title="New This Month"
          value={stats.newThisMonth}
          icon={TrendingUp}
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={filteredArtists}
        columns={columns}
        searchPlaceholder="Search artists by name, email, or specialization..."
        loading={loading}
        itemsPerPage={10}
        actions={(row: Artist) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVerifyTarget(row)}
              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              title={row.verified_by_admin ? 'Unverify' : 'Verify'}
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        )}
        filters={
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Artists</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          </div>
        }
      />

      {/* Verify Modal */}
      {verifyTarget && (
        <VerifyArtistModal
          artist={verifyTarget}
          onClose={() => setVerifyTarget(null)}
          onConfirm={async (verified: boolean) => {
            await handleVerify(verifyTarget.id, verified);
          }}
        />
      )}
    </div>
  );
}