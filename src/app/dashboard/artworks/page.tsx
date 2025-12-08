"use client";

import React, { useEffect, useState } from 'react';
import { Image, TrendingUp, CheckCircle, Clock, Edit2, Trash2, Send, Eye } from 'lucide-react';
import { artworkService, artistService } from '@/services/apiServices';
import { useAuth } from '@/lib/authProvider';
import { useToast } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ArtworkDetailsModal from '@/components/dashboard/ArtworkDetailsModal';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/dashboard/DataTable';

interface Artwork {
  id: number;
  title: string;
  description?: string;
  price: number | string;
  status?: string;
  is_available?: boolean;
  artist?: { id: number; user?: { first_name: string; last_name: string } };
  created_at?: string;
  main_image?: string;
  views?: number;
}

export default function Page() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'draft' | 'pending' | 'rejected'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<Artwork | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingArtworkId, setViewingArtworkId] = useState<number | null>(null);

  useEffect(() => {
    loadArtworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      if (user?.role === 'artist') {
        const res: any = await artistService.getMyArtworks();
        const artworksList = Array.isArray(res) ? res : (res?.results || []);
        setArtworks(artworksList);
      } else {
        const res: any = await artworkService.listArtworks();
        const artworksList = Array.isArray(res) ? res : (res?.results || []);
        setArtworks(artworksList);
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
      showToast('success', 'Artwork Created', 'Your artwork has been uploaded successfully!');
    } catch (err: any) {
      showToast('error', 'Creation Failed', err.message || 'Failed to create artwork');
    }
  };

  const updateArtwork = async (id: number, payload: any) => {
    try {
      const updated = await artworkService.updateArtwork(id, payload);
      setArtworks(prev => prev.map(a => a.id === updated.id ? updated : a));
      setEditingArtwork(null);
      setShowModal(false);
      showToast('success', 'Artwork Updated', 'Your changes have been saved successfully!');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Failed to update artwork');
    }
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArtwork(null);
  };

  const handleViewArtwork = (artworkId: number) => {
    setViewingArtworkId(artworkId);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (artwork: Artwork) => {
    setArtworkToDelete(artwork);
    setShowDeleteDialog(true);
  };

  const deleteArtwork = async () => {
    if (!artworkToDelete) return;
    
    try {
      await artworkService.deleteArtwork(artworkToDelete.id);
      setArtworks(prev => prev.filter(a => a.id !== artworkToDelete.id));
      showToast('success', 'Artwork Deleted', 'The artwork has been permanently removed.');
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message || 'Failed to delete artwork');
    } finally {
      setShowDeleteDialog(false);
      setArtworkToDelete(null);
    }
  };

  const submitForReview = async (id: number) => {
    try {
      const updated = await artworkService.submitForReview(id);
      setArtworks(prev => prev.map(a => a.id === updated.id ? updated : a));
      showToast('success', 'Submitted for Review', 'Your artwork has been submitted to admin for approval!');
    } catch (err: any) {
      showToast('error', 'Submission Failed', err.message || 'Failed to submit artwork for review');
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
      render: (value: string) => {
        const statusConfig = {
          approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };
        const className = statusConfig[value as keyof typeof statusConfig] || statusConfig.draft;
        
        return (
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Draft'}
          </span>
        );
      },
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
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Artwork) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewArtwork(row.id)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {user?.role === 'artist' && (row.status === 'draft' || row.status === 'rejected') && (
            <button
              onClick={() => submitForReview(row.id)}
              className="p-2 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors"
              title="Submit for Review"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          {user?.role === 'artist' && (
            <button
              onClick={() => handleEditArtwork(row)}
              className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
              title="Edit artwork"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {user?.role === 'artist' && (
            <button
              onClick={() => handleDeleteClick(row)}
              className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
              title="Delete artwork"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
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
        <ArtworkModal 
          onClose={handleCloseModal} 
          onSave={editingArtwork ? (payload) => updateArtwork(editingArtwork.id, payload) : createArtwork}
          editingArtwork={editingArtwork}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Artwork"
        message={`Are you sure you want to permanently delete "${artworkToDelete?.title}"? This action cannot be undone.`}
        onConfirm={deleteArtwork}
        onCancel={() => {
          setShowDeleteDialog(false);
          setArtworkToDelete(null);
        }}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

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

function ArtworkModal({ onClose, onSave, editingArtwork }: { onClose: () => void; onSave: (payload: any) => void; editingArtwork?: Artwork | null }) {
  const [title, setTitle] = useState(editingArtwork?.title || '');
  const [description, setDescription] = useState(editingArtwork?.description || '');
  const [category, setCategory] = useState('');
  const [medium, setMedium] = useState('');
  const [price, setPrice] = useState(editingArtwork?.price?.toString() || '');
  const [isAvailable, setIsAvailable] = useState(editingArtwork?.is_available ?? true);
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [depthCm, setDepthCm] = useState('');
  const [creationYear, setCreationYear] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(editingArtwork?.main_image || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    if (!editingArtwork && !imageFile) newErrors.imageFile = 'Main image is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingArtwork) {
      // Update existing artwork - send JSON payload for PATCH
      const payload: any = {
        title,
        description,
        price,
        is_available: isAvailable,
      };
      if (category) payload.category = category;
      if (medium) payload.medium = medium;
      if (widthCm) payload.width_cm = widthCm;
      if (heightCm) payload.height_cm = heightCm;
      if (depthCm) payload.depth_cm = depthCm;
      if (creationYear) payload.creation_year = creationYear;
      
      onSave(payload);
    } else {
      // Create new artwork - send FormData
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      if (category) fd.append('category', category);
      if (medium) fd.append('medium', medium);
      fd.append('price', price);
      fd.append('is_available', String(isAvailable));
      if (widthCm) fd.append('width_cm', widthCm);
      if (heightCm) fd.append('height_cm', heightCm);
      if (depthCm) fd.append('depth_cm', depthCm);
      if (creationYear) fd.append('creation_year', creationYear);
      if (imageFile) fd.append('main_image', imageFile);

      onSave(fd);
    }

    setTitle('');
    setDescription('');
    setCategory('');
    setMedium('');
    setPrice('');
    setWidthCm('');
    setHeightCm('');
    setDepthCm('');
    setCreationYear('');
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };


  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <form onSubmit={submit} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6 z-10 text-gray-900 dark:text-gray-100 my-8">
          <h3 className="text-2xl font-bold mb-6">{editingArtwork ? 'Edit Artwork' : 'Upload New Artwork'}</h3>

          {/* Image Preview Section */}
          {imagePreview && (
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
              </div>
            </div>
          )}

          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {/* Required Fields Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <span className="text-red-500">*</span> Required Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={e => { setTitle(e.target.value); if (errors.title) setErrors({...errors, title: ''}); }}
                    className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Sunset Over Mountains"
                    required
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={price}
                    onChange={e => { setPrice(e.target.value); if (errors.price) setErrors({...errors, price: ''}); }}
                    className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1500.00"
                    required
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => { setDescription(e.target.value); if (errors.description) setErrors({...errors, description: ''}); }}
                  className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  placeholder="Describe your artwork, its inspiration, and details..."
                  required
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Main Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  required
                />
                {errors.imageFile && <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supported formats: JPG, PNG, GIF, WebP</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Availability <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isAvailable === true}
                      onChange={() => setIsAvailable(true)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Available for Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isAvailable === false}
                      onChange={() => setIsAvailable(false)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Not Available</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set whether this artwork can be purchased</p>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Optional Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700"
                  >
                    <option value="">Select a category</option>
                    <option value="Painting">Painting</option>
                    <option value="Sculpture">Sculpture</option>
                    <option value="Photography">Photography</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Printmaking">Printmaking</option>
                    <option value="Mixed Media">Mixed Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Medium</label>
                  <select
                    value={medium}
                    onChange={e => setMedium(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700"
                  >
                    <option value="">Select a medium</option>
                    <option value="Oil">Oil</option>
                    <option value="Acrylic">Acrylic</option>
                    <option value="Watercolor">Watercolor</option>
                    <option value="Digital">Digital</option>
                    <option value="Pencil">Pencil</option>
                    <option value="Charcoal">Charcoal</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Stone">Stone</option>
                    <option value="Mixed Media">Mixed Media</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Width (cm)</label>
                  <input
                    value={widthCm}
                    onChange={e => setWidthCm(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Height (cm)</label>
                  <input
                    value={heightCm}
                    onChange={e => setHeightCm(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g., 75"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Depth (cm)</label>
                  <input
                    value={depthCm}
                    onChange={e => setDepthCm(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g., 10"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Creation Year</label>
                <input
                  value={creationYear}
                  onChange={e => setCreationYear(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-700"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              {editingArtwork ? 'Save Changes' : 'Upload Artwork'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
