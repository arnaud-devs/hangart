"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CheckCircle, Clock, RefreshCw, Eye } from 'lucide-react';
import sampleTransactions, { type Transaction } from '@/lib/sampleTransactions';
import sampleArtworks from '@/lib/sampleArtworks';
import TransactionViewModal from '@/components/dashboard/TransactionViewModal';

interface TransactionStats {
  total_transactions: number;
  total_revenue: number;
  completed_sales: number;
  pending_sales: number;
  refunded_amount: number;
  average_transaction: number;
}

export default function Page() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [viewTx, setViewTx] = useState<Transaction | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = async () => {
    try {
      setLoading(true);
      const raw = localStorage.getItem('user');
      const currentUser = raw ? JSON.parse(raw) : user;
      const currentArtistId = currentUser?.id || 'artist-01';

      const filtered = sampleTransactions.filter(tx => {
        const art = sampleArtworks.find(a => a.id === tx.artworkId);
        return art?.artistId === currentArtistId;
      });

      setTxs(filtered);

      // Calculate stats
      const completedTxs = filtered.filter(tx => tx.status === 'completed');
      const pendingTxs = filtered.filter(tx => tx.status === 'pending');
      const refundedTxs = filtered.filter(tx => tx.status === 'refunded');

      const totalRevenue = completedTxs.reduce((sum, tx) => sum + tx.amount, 0);
      const refundedAmount = refundedTxs.reduce((sum, tx) => sum + tx.amount, 0);

      setStats({
        total_transactions: filtered.length,
        total_revenue: totalRevenue,
        completed_sales: completedTxs.length,
        pending_sales: pendingTxs.length,
        refunded_amount: refundedAmount,
        average_transaction: filtered.length ? totalRevenue / filtered.length : 0,
      });

      // Mock chart data
      setChartData([
        { month: 'Jan', revenue: 450, transactions: 3, completed: 3 },
        { month: 'Feb', revenue: 620, transactions: 4, completed: 4 },
        { month: 'Mar', revenue: 850, transactions: 5, completed: 5 },
        { month: 'Apr', revenue: 1200, transactions: 7, completed: 6 },
        { month: 'May', revenue: 1680, transactions: 9, completed: 8 },
        { month: 'Jun', revenue: 2150, transactions: 11, completed: 10 },
      ]);
    } catch (e) {
      console.error('Error loading transaction data:', e);
    } finally {
      setLoading(false);
    }
  };

  function StatusBadge({ status }: { status?: Transaction['status'] }) {
    if (status === 'completed') return <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Completed</span>;
    if (status === 'pending') return <span className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full text-sm"><Clock className="w-4 h-4" />Pending</span>;
    return <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm"><RefreshCw className="w-4 h-4" />Refunded</span>;
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading transactions...</div>
      </div>
    );
  }

  const statusData = [
    { name: 'Completed', value: stats?.completed_sales || 0, fill: '#10b981' },
    { name: 'Pending', value: stats?.pending_sales || 0, fill: '#f59e0b' },
  ];

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
          value={stats?.completed_sales || 0}
          icon={CheckCircle}
          color="emerald"
          description="Successful orders"
          trend={{ value: 12, isPositive: true }}
        />

        <StatsCard
          title="Average Transaction"
          value={`$${(stats?.average_transaction || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="purple"
          description="Per sale value"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Revenue Trend</h3>
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
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Transaction Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Transaction Status</h3>
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

      {/* Bar Chart - Monthly Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Sales Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700" aria-label="Transactions table">
            <caption className="sr-only">List of transactions for your artworks</caption>
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">TX ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Artwork</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {txs.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">No transactions yet.</td></tr>
              )}
              {txs.map(tx => {
                const art = sampleArtworks.find(a => a.id === tx.artworkId);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{tx.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={art?.image || '/arts/art1.jpg'} alt={tx.artworkTitle} className="w-12 h-8 object-cover rounded" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{tx.artworkTitle}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">by {art?.artistName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{tx.buyerName}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">{tx.currency} {tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{tx.paymentMethod || 'Card'}</td>
                    <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button aria-label="View transaction" onClick={() => setViewTx(tx)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Eye className="w-4 h-4 text-gray-600 dark:text-gray-400"/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewTx && (
        <TransactionViewModal tx={viewTx} onClose={() => setViewTx(null)} />
      )}
    </div>
  );
}
