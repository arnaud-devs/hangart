"use client";

import React, { useEffect, useState } from 'react';
import { Image, CheckCircle, XCircle, Eye, Clock, MessageSquare, Archive } from 'lucide-react';
import { artworkService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import DataTable from '@/components/dashboard/DataTable';
import StatsCard from '@/components/dashboard/StatsCard';

interface Artwork {
  id: number;
  title: string;
  description?: string;
  price: number | string;
  status?: string;
  artist?: { 
    id: number; 
    user?: { 
      first_name: string; 
      last_name: string;
      username?: string;
    } 
  };
  created_at?: string;
  main_image?: string;
  views?: number;
  admin_comment?: string;
}

export default function Page() {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | 'archive' | null>(null);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const res: any = await artworkService.listArtworks({ ordering: '-created_at' });
      const artworksList = Array.isArray(res) ? res : (res?.results || []);
      // Filter for submitted/pending artworks only
      const pendingArtworks = artworksList.filter((a: Artwork) => 
        a.status === 'submitted' || a.status === 'pending'
      );
      setArtworks(pendingArtworks);
    } catch (err: any) {
      setError(err.message || 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const openApprovalModal = (artwork: Artwork, action: 'approve' | 'reject' | 'archive') => {
    setSelectedArtwork(artwork);
    setModalAction(action);
    setAdminComment('');
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedArtwork || !modalAction) return;

    try {
      const statusMap = {
        approve: 'approved',
        reject: 'rejected',
        archive: 'archived',
      };

      const updated = await artworkService.updateStatus(selectedArtwork.id, {
        status: statusMap[modalAction],
        admin_comment: adminComment.trim() || undefined,
      });

      setArtworks(prev => prev.filter(a => a.id !== selectedArtwork.id));
      setSuccess(`Artwork ${modalAction}d successfully!`);
      setShowModal(false);
      setSelectedArtwork(null);
      setModalAction(null);
      setAdminComment('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || `Failed to ${modalAction} artwork`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArtwork(null);
    setModalAction(null);
    setAdminComment('');
  };

  // Calculate stats
  const stats = {
    total: artworks.length,
    thisWeek: artworks.filter(a => {
      const created = new Date(a.created_at || '');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length,
    highValue: artworks.filter(a => Number(a.price) >= 1000).length,
  };

  const columns = [
    {
      key: 'title',
      label: 'Artwork',
      sortable: true,
      render: (value: string, row: Artwork) => (
        <div className="flex items-center gap-3">
          {row.main_image ? (
            <img src={row.main_image} alt={value} className="w-16 h-16 rounded object-cover" />
          ) : (
            <div className="w-16 h-16 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Image className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {row.description?.substring(0, 50)}{row.description && row.description.length > 50 ? '...' : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'artist',
      label: 'Artist',
      sortable: true,
      render: (_: any, row: Artwork) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.artist?.user 
              ? `${row.artist.user.first_name} ${row.artist.user.last_name}` 
              : 'Unknown'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            @{row.artist?.user?.username || 'N/A'}
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
      key: 'created_at',
      label: 'Submitted',
      sortable: true,
      render: (value: string) => (
        <div>
          <div className="text-gray-900 dark:text-gray-100">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          {value === 'submitted' ? 'Pending Review' : value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Artwork) => (
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/artwork/${row.id}`, '_blank')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="View artwork"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openApprovalModal(row, 'approve')}
            className="p-2 rounded-md hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
            title="Approve"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => openApprovalModal(row, 'reject')}
            className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            title="Reject"
          >
            <XCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => openApprovalModal(row, 'archive')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Artwork Approvals</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review and approve submitted artworks from artists
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Pending Review"
          value={stats.total}
          icon={Clock}
          color="blue"
          description="Artworks awaiting review"
        />
        <StatsCard
          title="This Week"
          value={stats.thisWeek}
          icon={CheckCircle}
          color="green"
          description="Submitted this week"
        />
        <StatsCard
          title="High Value"
          value={stats.highValue}
          icon={Image}
          color="purple"
          description="Price ≥ $1000"
        />
      </div>

      {/* Success Display */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {artworks.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Pending Artworks</h3>
          <p className="text-gray-600 dark:text-gray-400">
            All artworks have been reviewed. Check back later for new submissions.
          </p>
        </div>
      )}

      {/* Artworks Table */}
      {artworks.length > 0 && (
        <DataTable
          data={artworks}
          columns={columns}
          searchPlaceholder="Search artworks..."
          itemsPerPage={10}
        />
      )}

      {/* Approval Modal */}
      {showModal && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 z-10 text-gray-900 dark:text-gray-100 m-4">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              {modalAction === 'approve' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {modalAction === 'reject' && <XCircle className="w-6 h-6 text-red-600" />}
              {modalAction === 'archive' && <Archive className="w-6 h-6 text-gray-600" />}
              {modalAction === 'approve' ? 'Approve' : modalAction === 'reject' ? 'Reject' : 'Archive'} Artwork
            </h3>

            {/* Artwork Preview */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex gap-4">
                {selectedArtwork.main_image && (
                  <img 
                    src={selectedArtwork.main_image} 
                    alt={selectedArtwork.title}
                    className="w-32 h-32 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{selectedArtwork.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {selectedArtwork.artist?.user 
                      ? `${selectedArtwork.artist.user.first_name} ${selectedArtwork.artist.user.last_name}` 
                      : 'Unknown Artist'}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedArtwork.description}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    ${Number(selectedArtwork.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Comment for Artist {modalAction !== 'approve' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder={
                  modalAction === 'approve' 
                    ? 'Great work! Approved for marketplace.' 
                    : modalAction === 'reject'
                    ? 'Please provide feedback on why this artwork was rejected...'
                    : 'Reason for archiving...'
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-100 min-h-[100px]"
                required={modalAction !== 'approve'}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This comment will be visible to the artist
              </p>
            </div>

            {/* Action Description */}
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {modalAction === 'approve' && '✓ Artwork will be visible in the marketplace'}
                {modalAction === 'reject' && '✗ Artist can review feedback and resubmit'}
                {modalAction === 'archive' && '📦 Artwork will be removed from display'}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={modalAction !== 'approve' && !adminComment.trim()}
                className={`px-6 py-2 rounded-lg transition-colors font-medium text-white ${
                  modalAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : modalAction === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Confirm {modalAction === 'approve' ? 'Approval' : modalAction === 'reject' ? 'Rejection' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
