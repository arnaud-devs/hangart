"use client";

import React, { useEffect, useState } from 'react';
import { adminService, artworkService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '@/components/dashboard/StatsCard';
import { TrendingUp, Users, Image, ShoppingCart, CreditCard, RotateCcw, DollarSign, AlertCircle } from 'lucide-react';
import ArtworkDetailsModal from '@/components/dashboard/ArtworkDetailsModal';

interface DashboardStats {
  total_artworks: number;
  total_artists: number;
  total_buyers: number;
  total_orders: number;
  total_revenue: number;
  pending_approvals: number;
  total_refunds: number;
  pending_payments: number;
  completed_payments: number;
  recent_artworks: any[];
  top_artists: any[];
}

type ColorType = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'emerald';

interface StatsCardData {
  title: string;
  value: string | number;
  icon: any;
  color: ColorType;
  description: string;
  trend?: { value: number; isPositive: boolean };
}

export default function AdminDashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingArtworkId, setViewingArtworkId] = useState<number | null>(null);

  const handleViewArtwork = (artworkId: number) => {
    setViewingArtworkId(artworkId);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [artworks, artists] = await Promise.all([
        artworkService.listArtworks(),
        adminService.getUsers({ role: 'artist' }),
      ]);

      const buyers: any[] = [];

      const artworksList = (artworks as any).results || [];
      const artistsList = (artists as any).results || [];
      
      const dashboardStats: DashboardStats = {
        total_artworks: (artworks as any).count || artworksList.length || 0,
        total_artists: (artists as any).count || artistsList.length || 0,
        total_buyers: (buyers as any)?.count || (buyers as any)?.length || 0,
        total_orders: 0,
        total_revenue: artworksList.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0),
        pending_approvals: artworksList.filter((a: any) => a.status === 'pending').length || 0,
        total_refunds: 0,
        pending_payments: 0,
        completed_payments: 0,
        recent_artworks: artworksList.slice(0, 5),
        top_artists: artistsList.slice(0, 5),
      };

      setStats(dashboardStats);

      setChartData([
        { month: 'Jan', artworks: 12, artists: 8, orders: 24 },
        { month: 'Feb', artworks: 19, artists: 12, orders: 36 },
        { month: 'Mar', artworks: 15, artists: 10, orders: 28 },
        { month: 'Apr', artworks: 22, artists: 14, orders: 42 },
        { month: 'May', artworks: 28, artists: 18, orders: 54 },
        { month: 'Jun', artworks: 35, artists: 24, orders: 68 },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const statusData = [
    { name: 'Approved', value: stats?.total_artworks || 0, fill: '#10b981' },
    { name: 'Pending', value: stats?.pending_approvals || 0, fill: '#f59e0b' },
    { name: 'Rejected', value: Math.max(0, Math.floor((stats?.total_artworks || 0) * 0.1)), fill: '#ef4444' },
  ];

  const statsCards: StatsCardData[] = [
    {
      title: "Total Artworks",
      value: stats?.total_artworks || 0,
      icon: Image,
      color: "blue",
      description: "Active listings",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Total Artists",
      value: stats?.total_artists || 0,
      icon: Users,
      color: "green",
      description: "Registered creators",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Total Buyers",
      value: stats?.total_buyers || 0,
      icon: ShoppingCart,
      color: "purple",
      description: "Active customers",
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Pending Approvals",
      value: stats?.pending_approvals || 0,
      icon: TrendingUp,
      color: "orange",
      description: "Awaiting review"
    },
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: "emerald",
      description: "Completed transactions",
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "purple",
      description: "Platform earnings",
      trend: { value: 22, isPositive: true }
    },
    {
      title: "Approved Artworks",
      value: Math.max(0, (stats?.total_artworks || 0) - (stats?.pending_approvals || 0)),
      icon: Image,
      color: "green",
      description: "Ready to display",
      trend: { value: 10, isPositive: true }
    },
    {
      title: "Approval Rate",
      value: `${stats?.total_artworks ? Math.round(((stats?.total_artworks - stats?.pending_approvals) / stats?.total_artworks) * 100) : 0}%`,
      icon: TrendingUp,
      color: "red",
      description: "Quality metric",
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Completed Payments",
      value: stats?.completed_payments || 0,
      icon: CreditCard,
      color: "green",
      description: "Successful transactions",
      trend: { value: 18, isPositive: true }
    },
    {
      title: "Pending Payments",
      value: stats?.pending_payments || 0,
      icon: AlertCircle,
      color: "orange",
      description: "Awaiting processing"
    },
    {
      title: "Total Refunds",
      value: `$${(stats?.total_refunds || 0).toLocaleString()}`,
      icon: RotateCcw,
      color: "red",
      description: "Refund amount",
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Payment Success Rate",
      value: `${stats?.completed_payments && (stats?.completed_payments + stats?.pending_payments) ? Math.round((stats?.completed_payments / (stats?.completed_payments + stats?.pending_payments)) * 100) : 0}%`,
      icon: DollarSign,
      color: "blue",
      description: "Transaction reliability",
      trend: { value: 4, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 mb-8 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.first_name}! Here's your marketplace overview.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              description={card.description}
              trend={card.trend}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Trends */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Activity Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                />
                <Legend />
                <Line type="monotone" dataKey="artworks" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="artists" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Artwork Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Artworks and Top Artists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Artworks</h3>
            <div className="space-y-3">
              {stats?.recent_artworks?.map((artwork: any) => (
                <div key={artwork.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handleViewArtwork(artwork.id)}>
                  <div className="flex items-center space-x-3 flex-1">
                    <img
                      src={artwork.main_image || '/placeholder.jpg'}
                      alt={artwork.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {artwork.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {artwork.artist_name}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-2">
                    ${Number(artwork.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Top Artists</h3>
            <div className="space-y-3">
              {stats?.top_artists?.map((artist: any, index: number) => (
                <div key={artist.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {artist.first_name} {artist.last_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {artist.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400 ml-2">
                    Active
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && viewingArtworkId && (
        <ArtworkDetailsModal
          artworkId={viewingArtworkId}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}
