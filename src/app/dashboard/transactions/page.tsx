"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, CheckCircle, Clock, RefreshCw, Eye, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { listArtworks } from '@/lib/appClient';
import { getMyArtworks } from '@/lib/appClient';
import TransactionViewModal from '@/components/dashboard/TransactionViewModal';
import { GrReturn } from 'react-icons/gr';

interface TransactionStats {
  total_artworks: number;
  total_revenue: number;
  sold_count: number;
  available_count: number;
  average_price: number;
}

interface ChartData {
  month: string;
  revenue: number;
  sold: number;
}

interface PriceRangeData {
  name: string;
  value: number;
  color: string;
}

interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export default function Page() {
  const { user } = useAuth();
  const [soldArtworks, setSoldArtworks] = useState<any[]>([]);
  const [stats, setStats] = useState<{ total_revenue: number; total_transactions: number } | null>(null);
  const [viewArtwork, setViewArtwork] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<PriceRangeData[]>([]);
  const [statusDistributionData, setStatusDistributionData] = useState<StatusDistribution[]>([]);

  useEffect(() => {
    fetchSoldArtworks();
  }, []);

  async function fetchSoldArtworks() {
    try {
      setLoading(true);
      const response = await getMyArtworks();
      const artworksList = Array.isArray(response) ? response : response.results || [];
      // Only show sold artworks
      const sold = artworksList.filter(a => a.status === 'sold');
      setSoldArtworks(sold);
      // Stats
      const totalRevenue = sold.reduce((sum, a) => sum + parseFloat(String(a.price || '0')), 0);
      setStats({
        total_revenue: totalRevenue,
        total_transactions: sold.length,
      });
      
      // Prepare chart data
      prepareChartData(sold);
      
    } catch (e) {
      console.error('Error loading sold artworks:', e);
    } finally {
      setLoading(false);
    }
  }

  function prepareChartData(soldArtworks: any[]) {
    // Monthly chart data
    type MonthlyData = { month: string; revenue: number; sold: number };
    const monthly: { [key: string]: MonthlyData } = {};
    soldArtworks.forEach(a => {
      const dateStr = a.created_at ? a.created_at : '';
      const date = dateStr ? new Date(dateStr) : new Date();
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
      if (!monthly[key]) monthly[key] = { month: key, revenue: 0, sold: 0 };
      monthly[key].revenue += parseFloat(String(a.price || '0'));
      monthly[key].sold += 1;
    });
    setChartData(Object.values(monthly));

    // Price range distribution data
    const priceRanges = [
      { name: '$0 - $100', min: 0, max: 100, color: '#0088FE' },
      { name: '$101 - $500', min: 101, max: 500, color: '#00C49F' },
      { name: '$501 - $1000', min: 501, max: 1000, color: '#FFBB28' },
      { name: '$1001 - $5000', min: 1001, max: 5000, color: '#FF8042' },
      { name: '$5000+', min: 5001, max: Infinity, color: '#8884D8' }
    ];

    const priceRangeCounts = priceRanges.map(range => ({
      name: range.name,
      value: soldArtworks.filter(a => {
        const price = parseFloat(String(a.price || '0'));
        return price >= range.min && price <= range.max;
      }).length,
      color: range.color
    }));

    setPriceRangeData(priceRangeCounts);

    // Status distribution data (for all artworks, not just sold)
    const statusData = [
      { name: 'Sold', color: '#10b981' },
      { name: 'Available', color: '#3b82f6' },
      { name: 'Draft', color: '#6b7280' },
      { name: 'Submitted', color: '#f59e0b' },
      { name: 'Rejected', color: '#ef4444' },
      { name: 'Archived', color: '#9ca3af' }
    ];

    // This would need data from all artworks, not just sold
    // For now, we'll create sample data
    setStatusDistributionData([
      { name: 'Sold', value: soldArtworks.length, color: '#10b981' },
      { name: 'Available', value: Math.max(0, 10 - soldArtworks.length), color: '#3b82f6' },
      { name: 'Draft', value: 3, color: '#6b7280' },
      { name: 'Submitted', value: 2, color: '#f59e0b' },
      { name: 'Rejected', value: 1, color: '#ef4444' },
      { name: 'Archived', value: 1, color: '#9ca3af' }
    ]);
  }

  const fetchArtworksData = async () => {
    try {
      setLoading(true);
      const raw = localStorage.getItem('user');
      const currentUser = raw ? JSON.parse(raw) : user;
      const currentArtistId = currentUser?.id;
      const response = await listArtworks();
      const artworksList = Array.isArray(response) ? response : response.results || [];
      // Only show sold artworks for current artist
      const sold = artworksList.filter(a => a.artist_id === currentArtistId && a.status === 'sold');
      setSoldArtworks(sold);
      // Stats
      const totalRevenue = sold.reduce((sum, a) => sum + parseFloat(String(a.price || '0')), 0);
      setStats({
        total_revenue: totalRevenue,
        total_transactions: sold.length,
      });
    } catch (e) {
      console.error('Error loading sold artworks:', e);
    } finally {
      setLoading(false);
    }
  };

  function StatusBadge({ status }: { status?: string }) {
    if (status === 'sold') return <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Sold</span>;
    if (status === 'approved') return <span className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Approved</span>;
    if (status === 'submitted') return <span className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full text-sm"><Clock className="w-4 h-4" />Submitted</span>;
    if (status === 'draft') return <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/20 px-3 py-1 rounded-full text-sm"><Clock className="w-4 h-4" />Draft</span>;
    if (status === 'rejected') return <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm"><RefreshCw className="w-4 h-4" />Rejected</span>;
    if (status === 'archived') return <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700/20 px-3 py-1 rounded-full text-sm">Archived</span>;
    return <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/20 px-3 py-1 rounded-full text-sm">Unknown</span>;
  }

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track all your sales and earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats?.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="green"
          description="All-time earnings"
          trend={{ value: 22, isPositive: true }}
        />

        <StatsCard
          title="Total Transactions"
            value={stats?.total_transactions || 0}
          icon={TrendingUp}
          color="blue"
          description="Sales count"
          trend={{ value: 15, isPositive: true }}
        />

        <StatsCard
          title="Completed Sales"
            value={stats?.total_revenue || 0}
            icon={CheckCircle}
            color="emerald"
            description="Total sold artworks"
          />

        <StatsCard
          title="Average Price"
          value={`$${stats?.total_transactions ? (stats.total_revenue / stats.total_transactions).toFixed(2) : '0.00'}`}
          icon={BarChartIcon}
          color="purple"
          description="Per artwork"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} width={60} tickFormatter={v => `$${v}`}/>
              <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 500 }} labelStyle={{ color: '#a3a3a3' }} formatter={v => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Range Distribution (Pie Chart) */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Price Range Distribution</h3>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={priceRangeData as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priceRangeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [`${value} artworks`, props.payload.name]}
                contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 500 }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sold Artworks by Month (Bar Chart) */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sold Artworks by Month</h3>
            <BarChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} width={40} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 500 }} labelStyle={{ color: '#a3a3a3' }} formatter={v => [`${v}`, 'Sold']} />
              <Bar dataKey="sold" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution (Bar Chart - Horizontal) */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Artworks Status Distribution</h3>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart 
              data={statusDistributionData} 
              layout="vertical"
              margin={{ top: 10, right: 24, left: 60, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" axisLine={false} tickLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#9ca3af" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 500 }}
                formatter={(value, name, props) => [`${value} artworks`, props.payload.name]}
              />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                radius={[0, 8, 8, 0]}
                barSize={20}
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={statusDistributionData[index].color}
                      rx={4}
                      ry={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Artworks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700" aria-label="Sold Artworks table">
            <caption className="sr-only">List of your sold artworks</caption>
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Artwork ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Artwork</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {soldArtworks.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">No sold artworks found.</td></tr>
              )}
              {soldArtworks.map(art => (
                <tr key={art.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{art.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(art.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={art.main_image || '/arts/art1.jpg'} alt={art.title} className="w-12 h-8 object-cover rounded" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{art.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{art.artist_name}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">${parseFloat(art.price).toFixed(2)}</td>
                  <td className="px-6 py-4"><StatusBadge status={art.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button aria-label="View artwork" onClick={() => setViewArtwork(art)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Eye className="w-4 h-4 text-gray-600 dark:text-gray-400"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewArtwork && (
        <TransactionViewModal tx={viewArtwork} onClose={() => setViewArtwork(null)} />
      )}
    </div>
  );
}