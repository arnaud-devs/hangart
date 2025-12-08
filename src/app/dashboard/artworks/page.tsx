"use client";

import React, { useEffect, useState } from 'react';
import { Image, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { artworkService, artistService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/dashboard/DataTable';

interface Artwork {
  id: number;
  title: string;
  description?: string;
  price: number | string;
  status?: string;
  artist?: { id: number; user?: { first_name: string; last_name: string } };
  created_at?: string;
  main_image?: string;
  views?: number;
}

export default function Page() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadArtworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      if (user?.role === 'artist') {
        const res: any = await artistService.getMyArtworks();
        setArtworks(res.results || res || []);
      } else {
        const res: any = await artworkService.listArtworks();
        setArtworks(res.results || res || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const createArtwork = async (formData: FormData) => {
    try {
      const created = await artworkService.createArtwork(formData as any);
      setArtworks(prev => [created as any, ...prev]);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create artwork');
    }
  };

  const updateArtwork = async (id: number, payload: any) => {
    try {
      const updated = await artworkService.updateArtwork(id, payload);
      setArtworks(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (err: any) {
      setError(err.message || 'Failed to update artwork');
    }
  };

  const deleteArtwork = async (id: number) => {
    try {
      await artworkService.deleteArtwork(id);
      setArtworks(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete artwork');
    }
  };

  // Calculate stats
  const stats = {
    total: artworks.length,
    approved: artworks.filter(a => a.status === 'approved').length,
    pending: artworks.filter(a => a.status === 'pending').length,
    rejected: artworks.filter(a => a.status === 'rejected').length,
  };

  // Filter artworks
  const filteredArtworks = artworks.filter(a => {
    if (statusFilter === 'approved') return a.status === 'approved';
    if (statusFilter === 'pending') return a.status === 'pending';
    if (statusFilter === 'rejected') return a.status === 'rejected';
    return true;
  });

  const columns = [
    {
      key: 'title',
      label: 'Artwork',
      sortable: true,
      render: (value: string, row: Artwork) => (
        <div className="flex items-center gap-3">
          {row.main_image ? (
            <img src={row.main_image} alt={value} className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Image className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.artist?.user ? `${row.artist.user.first_name} ${row.artist.user.last_name}` : 'Unknown artist'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number | string) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          ${Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            value === 'approved'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : value === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (value: number) => (
        <span className="text-gray-900 dark:text-gray-100">{value || 0}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value: string) => (
        <span className="text-gray-900 dark:text-gray-100">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Artworks Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage artworks and their approval status
          </p>
        </div>
        {user?.role === 'artist' && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Add Artwork
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Artworks"
          value={stats.total}
          icon={Image}
          color="blue"
          description="All artworks"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="orange"
          description="Awaiting approval"
        />
        <StatsCard
          title="Trending"
          value={Math.max(...artworks.map(a => a.views || 0))}
          icon={TrendingUp}
          color="purple"
          description="Highest views"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {artworks.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Image className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Artworks Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {user?.role === 'artist' ? "You haven't uploaded any artworks yet." : 'No artworks available.'}
          </p>
          {user?.role === 'artist' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Upload Your First Artwork
            </button>
          )}
        </div>
      )}

      {/* Data Table */}
      {artworks.length > 0 && (
        <DataTable
          data={filteredArtworks}
          columns={columns}
          searchPlaceholder="Search artworks by title or artist..."
          loading={loading}
          itemsPerPage={10}
          filters={
            user?.role !== 'artist' ? (
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Approval Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Artworks</option>
                    <option value="approved">Approved Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="rejected">Rejected Only</option>
                  </select>
                </div>
              </div>
            ) : null
          }
        />
      )}

      {showModal && (
        <ArtworkModal onClose={() => setShowModal(false)} onSave={createArtwork} />
      )}
    </div>
  );
}

function ArtworkModal({ onClose, onSave }: { onClose: () => void; onSave: (fd: FormData) => void }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('price', price);
    fd.append('description', description);
    if (imageFile) fd.append('main_image', imageFile);
    onSave(fd);
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <form onSubmit={submit} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 text-gray-900 dark:text-gray-100">
          <h3 className="text-lg font-semibold mb-4">Add New Artwork</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
              <input value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" type="number" min="0" step="0.01" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Main Image (file)</label>
              <input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} accept="image/*" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

