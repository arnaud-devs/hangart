// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { adminService, artworkService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '@/components/dashboard/StatsCard';
import { TrendingUp, Users, Image, ShoppingCart, CreditCard, RotateCcw, DollarSign, AlertCircle } from 'lucide-react';

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

      const dashboardStats: DashboardStats = {
        total_artworks: (artworks as any).count || (artworks as any).length || 0,
        total_artists: (artists as any).count || (artists as any).length || 0,
        total_buyers: (buyers as any)?.count || (buyers as any)?.length || 0,
        total_orders: 0,
        total_revenue: 0,
        pending_approvals: (artworks as any).results?.filter((a: any) => a.status === 'submitted').length || 0,
        total_refunds: 0,
        pending_payments: 0,
        completed_payments: 0,
        recent_artworks: (artworks as any).results?.slice(0, 5) || [],
        top_artists: (artists as any).results?.slice(0, 5) || [],
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
                    <div className="text-xs text-gray-500 dark:text-gray-400">{artwork.artist_name}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">${artwork.price}</div>
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
    </div>
  );
}

function ArtistView({ user }: { user: any }) {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Artist Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back, {user.first_name}. Manage your artworks and profile.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/dashboard/artworks" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">My Artworks</a>
          <a href="/dashboard/profile" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Profile</a>
          <a href="/dashboard/transactions" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Transactions</a>
          <a href="/dashboard/requests" className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Requests</a>
        </div>
      </div>
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