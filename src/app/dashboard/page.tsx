// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { adminService, artworkService, artistService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '@/components/dashboard/StatsCard';
import { TrendingUp, Users, Image, ShoppingCart, CreditCard, RotateCcw, DollarSign, AlertCircle, CheckCircle, Clock, Eye } from 'lucide-react';
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

  // Admin dashboard (existing)
  if (user.role === 'admin') {
    return <AdminView />;
  }

  // Artist dashboard
  if (user.role === 'artist') {
    return <ArtistView user={user} />;
  }

  // Buyer dashboard
  if (user.role === 'buyer') {
    return <BuyerView user={user} />;
  }

  // Default fallback
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">Role not recognized</div>
    </div>
  );
}

function AdminView() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [artworks, artists] = await Promise.all([
        artworkService.listArtworks(),
        adminService.getUsers({ role: 'artist' }),
      ]);

      // Backend does not expose a public buyers listing endpoint; leave buyers empty for now.
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

      // Mock chart data
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

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.first_name}! Here's your marketplace overview.</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Artworks"
          value={stats?.total_artworks || 0}
          icon={Image}
          color="blue"
          description="Active listings"
          trend={{ value: 12, isPositive: true }}
        />

        <StatsCard
          title="Total Artists"
          value={stats?.total_artists || 0}
          icon={Users}
          color="green"
          description="Registered creators"
          trend={{ value: 8, isPositive: true }}
        />

        <StatsCard
          title="Total Buyers"
          value={stats?.total_buyers || 0}
          icon={ShoppingCart}
          color="purple"
          description="Active customers"
          trend={{ value: 5, isPositive: true }}
        />

        <StatsCard
          title="Pending Approvals"
          value={stats?.pending_approvals || 0}
          icon={TrendingUp}
          color="orange"
          description="Awaiting review"
        />
      </div>

      {/* Additional Stats Cards - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats?.total_orders || 0}
          icon={ShoppingCart}
          color="emerald"
          description="Completed transactions"
          trend={{ value: 15, isPositive: true }}
        />

        <StatsCard
          title="Total Revenue"
          value={`$${(stats?.total_revenue || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
          description="Platform earnings"
          trend={{ value: 22, isPositive: true }}
        />

        <StatsCard
          title="Approved Artworks"
          value={Math.max(0, (stats?.total_artworks || 0) - (stats?.pending_approvals || 0))}
          icon={Image}
          color="green"
          description="Ready to display"
          trend={{ value: 10, isPositive: true }}
        />

        <StatsCard
          title="Approval Rate"
          value={`${stats?.total_artworks ? Math.round(((stats?.total_artworks - stats?.pending_approvals) / stats?.total_artworks) * 100) : 0}%`}
          icon={TrendingUp}
          color="red"
          description="Quality metric"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Financial Stats Cards - Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Completed Payments"
          value={stats?.completed_payments || 0}
          icon={CreditCard}
          color="green"
          description="Successful transactions"
          trend={{ value: 18, isPositive: true }}
        />

        <StatsCard
          title="Pending Payments"
          value={stats?.pending_payments || 0}
          icon={AlertCircle}
          color="orange"
          description="Awaiting processing"
        />

        <StatsCard
          title="Total Refunds"
          value={`$${(stats?.total_refunds || 0).toLocaleString()}`}
          icon={RotateCcw}
          color="red"
          description="Refund amount"
          trend={{ value: 2, isPositive: false }}
        />

        <StatsCard
          title="Payment Success Rate"
          value={`${stats?.completed_payments && (stats?.completed_payments + stats?.pending_payments) ? Math.round((stats?.completed_payments / (stats?.completed_payments + stats?.pending_payments)) * 100) : 0}%`}
          icon={DollarSign}
          color="blue"
          description="Transaction reliability"
          trend={{ value: 4, isPositive: true }}
        />
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

        {/* Pie Chart - Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Approval Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
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

      {/* Bar Chart - Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Growth Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="artworks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="artists" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Artworks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Artworks</h3>
          <div className="space-y-3">
            {stats?.recent_artworks?.map((artwork: any) => (
              <div key={artwork.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={artwork.main_image || '/artworks/default.jpg'} alt={artwork.title} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{artwork.artist_name || 'Unknown'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">${Number(artwork.price).toFixed(2)}</div>
                  <button
                    onClick={() => handleViewArtwork(artwork.id)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/dashboard/artists" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">Manage Artists</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">View and manage all registered artists</div>
            </a>

            <a href="/dashboard/buyers" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent dark:hover:from-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">Manage Buyers</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">View and manage all registered buyers</div>
            </a>

            <a href="/dashboard/artworks" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent dark:hover:from-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">Review Artworks</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Approve or reject submitted artworks</div>
            </a>

            <a href="/dashboard/orders" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent dark:hover:from-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">Manage Orders</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">View and process customer orders</div>
            </a>
          </div>
        </div>
      </div>

      {/* Artwork Details Modal */}
      {showDetailsModal && viewingArtworkId && (
        <ArtworkDetailsModal
          artworkId={viewingArtworkId}
          onClose={() => {
            setShowDetailsModal(false);
            setViewingArtworkId(null);
          }}
        />
      )}
    </div>
  );
}

function ArtistView({ user }: { user: any }) {
  const [artistStats, setArtistStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingArtworkId, setViewingArtworkId] = useState<number | null>(null);

  const handleViewArtwork = (artworkId: number) => {
    setViewingArtworkId(artworkId);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    loadArtistData();
  }, []);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      const artworks = await artistService.getMyArtworks();
      const artworksList = Array.isArray(artworks) ? artworks : ((artworks as any).results || []);

      const stats = {
        total_artworks: artworksList.length,
        published: artworksList.filter((a: any) => a.status === 'approved').length,
        pending: artworksList.filter((a: any) => a.status === 'pending').length,
        rejected: artworksList.filter((a: any) => a.status === 'rejected').length,
        total_views: artworksList.reduce((sum: number, a: any) => sum + (a.views || 0), 0),
        total_earnings: artworksList.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0),
        avg_price: artworksList.length ? (artworksList.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0) / artworksList.length).toFixed(2) : 0,
        recent_artworks: artworksList.slice(0, 5),
      };

      setArtistStats(stats);

      // Mock chart data for artist's performance
      setChartData([
        { month: 'Jan', views: 120, sales: 3, earnings: 450 },
        { month: 'Feb', views: 150, sales: 4, earnings: 620 },
        { month: 'Mar', views: 200, sales: 5, earnings: 850 },
        { month: 'Apr', views: 280, sales: 7, earnings: 1200 },
        { month: 'May', views: 350, sales: 9, earnings: 1680 },
        { month: 'Jun', views: 420, sales: 11, earnings: 2150 },
      ]);
    } catch (err) {
      console.error('Error loading artist data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Artist Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user.first_name}! Manage your artworks and earnings.</p>
      </div>

      {/* Stats Cards - Artist Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Artworks"
          value={artistStats?.total_artworks || 0}
          icon={Image}
          color="blue"
          description="Your creations"
          trend={{ value: 5, isPositive: true }}
        />

        <StatsCard
          title="Published"
          value={artistStats?.published || 0}
          icon={CheckCircle}
          color="green"
          description="Live on marketplace"
          trend={{ value: 8, isPositive: true }}
        />

        <StatsCard
          title="Pending Review"
          value={artistStats?.pending || 0}
          icon={Clock}
          color="orange"
          description="Awaiting approval"
        />

        <StatsCard
          title="Total Views"
          value={artistStats?.total_views || 0}
          icon={TrendingUp}
          color="purple"
          description="Profile interactions"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Potential Earnings"
          value={`$${Number(artistStats?.total_earnings || 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
          description="Sum of artwork prices"
          trend={{ value: 15, isPositive: true }}
        />

        <StatsCard
          title="Average Price"
          value={`$${artistStats?.avg_price || 0}`}
          icon={CreditCard}
          color="blue"
          description="Per artwork average"
          trend={{ value: 3, isPositive: true }}
        />

        <StatsCard
          title="Approval Rate"
          value={`${artistStats?.total_artworks ? Math.round((artistStats?.published / artistStats?.total_artworks) * 100) : 0}%`}
          icon={CheckCircle}
          color="emerald"
          description="Quality metric"
          trend={{ value: 6, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Performance Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Performance Trend</h3>
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
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Artwork Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Artwork Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Published', value: artistStats?.published || 0, fill: '#10b981' },
                  { name: 'Pending', value: artistStats?.pending || 0, fill: '#f59e0b' },
                  { name: 'Rejected', value: artistStats?.rejected || 0, fill: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Artworks & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Uploads</h3>
          <div className="space-y-3">
            {artistStats?.recent_artworks?.map((artwork: any) => (
              <div key={artwork.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <img src={artwork.main_image || '/artworks/default.jpg'} alt={artwork.title} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        artwork.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20' :
                        artwork.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20'
                      }`}>
                        {artwork.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">${Number(artwork.price).toFixed(2)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{artwork.views || 0} views</div>
                  </div>
                  <button
                    onClick={() => handleViewArtwork(artwork.id)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/dashboard/artworks" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">My Artworks</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Manage and view all your creations</div>
            </a>

            <a href="/dashboard/artworks?upload=true" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent dark:hover:from-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">Upload New Artwork</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Add a new creation to your portfolio</div>
            </a>

            <a href="/dashboard/profile" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent dark:hover:from-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">Edit Profile</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Update your artist information</div>
            </a>

            <a href="/dashboard/transactions" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent dark:hover:from-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
              <div className="font-medium text-gray-900 dark:text-gray-100">View Transactions</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Track your sales and earnings</div>
            </a>
          </div>
        </div>
      </div>

      {/* Artwork Details Modal */}
      {showDetailsModal && viewingArtworkId && (
        <ArtworkDetailsModal
          artworkId={viewingArtworkId}
          onClose={() => {
            setShowDetailsModal(false);
            setViewingArtworkId(null);
          }}
        />
      )}
    </div>
  );
}

function BuyerView({ user }: { user: any }) {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buyer Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back, {user.first_name}. Browse art and manage orders.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/dashboard/artworks" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Browse Artworks</a>
          <a href="/dashboard/wishlist" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Wishlist</a>
          <a href="/dashboard/orders" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Orders</a>
          <a href="/dashboard/profile" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Profile</a>
        </div>
      </div>
    </div>
  );
}