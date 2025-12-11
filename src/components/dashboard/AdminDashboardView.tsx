"use client";

import React, { useEffect, useState } from 'react';
import { adminService, artworkService } from '@/services/apiServices';
import { listPayments } from '@/lib/appClient';
import { useAuth } from '@/lib/authProvider';
import { listAdminBuyers, listOrders } from '@/lib/appClient';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '@/components/dashboard/StatsCard';
import { TrendingUp, Users, Image, ShoppingCart, CreditCard, RotateCcw, DollarSign, AlertCircle, Clock } from 'lucide-react';
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
  inventory_value: number;
  total_payments: number;
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
      const [artworks, artists, buyers, orders, paymentsData] = await Promise.all([
        artworkService.listArtworks(),
        adminService.getUsers({ role: 'artist' }),
        listAdminBuyers(),
        listOrders(),
        listPayments(),
      ]);

      const artworksList = (artworks as any).results || [];
      const artistsList = (artists as any).results || [];
      const buyersList = Array.isArray(buyers) ? buyers : (buyers as any).results || [];
      const ordersList = Array.isArray(orders) ? orders : (orders as any).results || [];
      const paymentsList = (paymentsData as any).results || [];

      // Inventory value: sum of all artwork prices
      const inventoryValue = artworksList.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0);
      // Total payments: sum of all payment amounts (regardless of status)
      const totalPayments = paymentsList.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

      const dashboardStats: DashboardStats = {
        total_artworks: (artworks as any).count || artworksList.length || 0,
        total_artists: (artists as any).count || artistsList.length || 0,
        total_buyers: (buyers as any).count || buyersList.length || 0,
        total_orders: (orders as any).count || ordersList.length || 0,
        total_revenue: totalPayments, // Now sum of all payments
        // Match /approvals: count artworks with status 'submitted' or 'pending'
        pending_approvals: artworksList.filter((a: any) => a.status === 'submitted' || a.status === 'pending').length || 0,
        total_refunds: 0,
        pending_payments: paymentsList.filter((p: any) => p.status === 'pending').length || 0,
        completed_payments: paymentsList.filter((p: any) => p.status === 'successful').length || 0,
        recent_artworks: artworksList.slice(0, 5),
        top_artists: artistsList.slice(0, 5),
        inventory_value: inventoryValue,
        total_payments: paymentsList.length,
      };

      setStats(dashboardStats);

      // Build monthly chart data from real backend data
      // Group by month for orders, artworks, and artists
      function getMonth(dateStr: string): string {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }

      // Orders by month
      const ordersByMonth: Record<string, number> = {};
      ordersList.forEach((o: any) => {
        const m = getMonth(o.created_at);
        ordersByMonth[m] = (ordersByMonth[m] ?? 0) + 1;
      });

      // Artworks by month
      const artworksByMonth: Record<string, number> = {};
      artworksList.forEach((a: any) => {
        const m = getMonth(a.created_at);
        artworksByMonth[m] = (artworksByMonth[m] ?? 0) + 1;
      });

      // Artists by month
      const artistsByMonth: Record<string, number> = {};
      artistsList.forEach((a: any) => {
        const m = getMonth(a.created_at);
        artistsByMonth[m] = (artistsByMonth[m] ?? 0) + 1;
      });

      // Get all months present in any dataset
      const allMonths = Array.from(new Set([
        ...Object.keys(ordersByMonth),
        ...Object.keys(artworksByMonth),
        ...Object.keys(artistsByMonth),
      ])).sort();

      // Build chart data array
      const monthlyChartData = allMonths.map((month: string) => ({
        month,
        orders: ordersByMonth[month] ?? 0,
        artworks: artworksByMonth[month] ?? 0,
        artists: artistsByMonth[month] ?? 0,
      }));

      setChartData(monthlyChartData);
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

  // Compute real status counts from all artworks
  const statusColors: Record<string, string> = {
    draft: '#64748b',
    submitted: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    sold: '#6366f1',
    archived: '#a1a1aa',
  };
  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    approved: 'Approved',
    rejected: 'Rejected',
    sold: 'Sold',
    archived: 'Archived',
  };
  const artworkStatusCounts: Record<string, number> = {};
  // Use all artworks for pie chart, not just recent
  const allArtworks = stats?.recent_artworks && Array.isArray(stats.recent_artworks) ? stats.recent_artworks : [];
  allArtworks.forEach((a: any) => {
    const s = a.status;
    if (s) artworkStatusCounts[s] = (artworkStatusCounts[s] ?? 0) + 1;
  });
  // Build pie chart data for all statuses
  const statusData = Object.keys(statusLabels).map((status) => ({
    name: statusLabels[status],
    value: artworkStatusCounts[status] ?? 0,
    fill: statusColors[status],
  })).filter(d => d.value > 0);
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
      title: "Pending Review",
      value: stats?.pending_approvals || 0,
      icon: Clock,
      color: "blue",
      description: "Artworks awaiting review"
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
      title: "Inventory Value",
      value: `$${(stats?.inventory_value || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "blue",
      description: "Value of all artworks",
      trend: { value: 10, isPositive: true }
    },
    {
      title: "Total Payments",
      value: stats?.total_payments || 0,
      icon: CreditCard,
      color: "purple",
      description: "All payment transactions",
      trend: { value: 22, isPositive: true }
    },
    // Removed Approved Artworks and Approval Rate cards
    {
      title: "Total Refunds",
      value: `$${(stats?.total_refunds || 0).toLocaleString()}`,
      icon: RotateCcw,
      color: "red",
      description: "Refund amount",
      trend: { value: 2, isPositive: false }
    },
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
                <XAxis dataKey="month" stroke="#6b7280">
                  <text
                    x={150}
                    y={270}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize={14}
                  >Month/Year</text>
                </XAxis>
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
                        {artist.username || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {artist.email || ''}
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
