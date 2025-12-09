// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { adminService, artworkService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';

interface DashboardStats {
  total_artworks: number;
  total_artists: number;
  total_buyers: number;
  total_orders: number;
  total_revenue: number;
  pending_approvals: number;
  recent_artworks: any[];
  top_artists: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      loadDashboardData();
    }
  }, [authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // In a real implementation, you'd have a dedicated dashboard endpoint
      // Fetch artworks and artists. Backend does not expose a buyers listing endpoint.
      const [artworks, artists] = await Promise.all([
        artworkService.listArtworks(),
        adminService.getUsers({ role: 'artist' }),
      ]);

      const buyers: any[] = [];

      const dashboardStats: DashboardStats = {
        total_artworks: artworks.count || artworks.length || 0,
        total_artists: artists.count || artists.length || 0,
        total_buyers: (buyers as any)?.count || (buyers as any)?.length || 0,
        total_orders: 0, // You'd fetch from orders endpoint
        total_revenue: 0, // You'd calculate from orders
        pending_approvals: artworks.results?.filter((a: any) => a.status === 'submitted').length || 0,
        recent_artworks: artworks.results?.slice(0, 5) || [],
        top_artists: artists.results?.slice(0, 5) || [],
      };

      setStats(dashboardStats);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      label: 'Total Artworks',
      value: stats?.total_artworks || 0,
      color: 'text-gray-900 dark:text-gray-100'
    },
    {
      label: 'Total Artists',
      value: stats?.total_artists || 0,
      color: 'text-gray-900 dark:text-gray-100'
    },
    {
      label: 'Total Buyers',
      value: stats?.total_buyers || 0,
      color: 'text-gray-900 dark:text-gray-100'
    },
    {
      label: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  const quickActions = [
    {
      href: '/dashboard/artists',
      title: 'Manage Artists',
      description: 'View and manage all registered artists'
    },
    {
      href: '/dashboard/buyers',
      title: 'Manage Buyers',
      description: 'View and manage all registered buyers'
    },
    {
      href: '/dashboard/artworks',
      title: 'Review Artworks',
      description: 'Approve or reject submitted artworks'
    },
    {
      href: '/dashboard/orders',
      title: 'Manage Orders',
      description: 'View and process customer orders'
    }
  ];

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading authentication...</div>
        </div>
      </div>
    );
  }

  // Redirect or show error if user is not admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Access denied. Admin privileges required.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Welcome back, {user?.first_name}! Here's your marketplace overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-300">{card.label}</div>
              <div className={`text-2xl font-semibold ${card.color}`}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Artworks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Recent Artworks
            </h3>
            <div className="space-y-3">
              {stats?.recent_artworks?.map((artwork: any) => (
                <div key={artwork.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={artwork.main_image || '/artworks/default.jpg'}
                      alt={artwork.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {artwork.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {artwork.artist_name}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ${artwork.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {action.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {action.description}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}