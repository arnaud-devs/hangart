"use client";

import React, { useEffect, useState } from 'react';
import { X, User, Calendar, DollarSign, Ruler, Tag, Package, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { artworkService } from '@/services/apiServices';
import { useToast } from '@/components/ui/Toast';

interface ArtworkDetails {
  id: number;
  artist: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
    artist_profile?: {
      bio: string;
      specialization: string;
      verified_by_admin: boolean;
    };
  };
  title: string;
  slug: string;
  description: string;
  category: string;
  medium: string;
  width_cm: string;
  height_cm: string;
  depth_cm?: string;
  creation_year: number;
  price: string;
  is_available: boolean;
  main_image: string;
  additional_images: string[];
  status: string;
  admin_comment?: string;
  created_at: string;
  updated_at: string;
  views?: number;
}

interface ArtworkDetailsModalProps {
  artworkId: number;
  onClose: () => void;
}

export default function ArtworkDetailsModal({ artworkId, onClose }: ArtworkDetailsModalProps) {
  const [artwork, setArtwork] = useState<ArtworkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    loadArtworkDetails();
  }, [artworkId]);

  const loadArtworkDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artworkService.getArtwork(artworkId);
      setArtwork(data);
      setSelectedImage(data.main_image);
    } catch (err: any) {
      const errorMessage = err.message || 'Could not load artwork details';
      setError(errorMessage);
      
      // Show toast for 404 or other errors
      if (err.status === 404) {
        showToast('error', 'Artwork Not Found', 'This artwork may have been deleted or does not exist.');
      } else {
        showToast('error', 'Failed to Load', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      approved: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20', label: 'Approved' },
      pending: { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20', label: 'Pending' },
      submitted: { icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20', label: 'Submitted' },
      rejected: { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20', label: 'Rejected' },
      draft: { icon: AlertCircle, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/20', label: 'Draft' },
      archived: { icon: Package, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/20', label: 'Archived' },
    };
    const config = configs[status as keyof typeof configs] || configs.draft;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading artwork details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Artwork
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Artwork Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={selectedImage}
                    alt={artwork.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Additional Images */}
                {artwork.additional_images && artwork.additional_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedImage(artwork.main_image)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === artwork.main_image
                          ? 'border-emerald-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img src={artwork.main_image} alt="Main" className="w-full h-full object-cover" />
                    </button>
                    {artwork.additional_images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === img
                            ? 'border-emerald-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Title and Status */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{artwork.title}</h1>
                    {getStatusBadge(artwork.status)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Slug: {artwork.slug}
                  </p>
                </div>

                {/* Artist Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {artwork.artist.first_name} {artwork.artist.last_name}
                        {artwork.artist.artist_profile?.verified_by_admin && (
                          <CheckCircle className="w-4 h-4 inline ml-1 text-blue-600" />
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{artwork.artist.username}</p>
                      {artwork.artist.artist_profile?.specialization && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {artwork.artist.artist_profile.specialization}
                        </p>
                      )}
                    </div>
                    <a
                      href={`/artist/${artwork.artist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="View artist profile"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </a>
                  </div>
                  {artwork.artist.artist_profile?.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                      {artwork.artist.artist_profile.bio}
                    </p>
                  )}
                </div>

                {/* Price and Availability */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(artwork.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Availability</p>
                    <p className={`font-semibold ${artwork.is_available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {artwork.is_available ? 'Available' : 'Sold Out'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{artwork.description}</p>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Category</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{artwork.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Medium</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{artwork.medium}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Ruler className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Dimensions</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {artwork.width_cm} × {artwork.height_cm}
                        {artwork.depth_cm && ` × ${artwork.depth_cm}`} cm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Year Created</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{artwork.creation_year}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Comment */}
                {artwork.admin_comment && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">Admin Comment</p>
                    <p className="text-sm text-blue-800 dark:text-blue-300">{artwork.admin_comment}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(artwork.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(artwork.updated_at).toLocaleString()}
                    </span>
                  </div>
                  {artwork.views !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Views</span>
                      <span className="text-gray-900 dark:text-gray-100">{artwork.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
            <a
              href={`/artwork/${artwork.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium inline-flex items-center gap-2"
            >
              View Public Page
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
