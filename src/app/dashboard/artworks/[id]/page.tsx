"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, DollarSign, Eye, Heart, Package, Tag, Ruler, Palette, CheckCircle, XCircle, Clock, Edit2 } from 'lucide-react';
import { getArtwork } from '@/lib/appClient';
import { useAuth } from '@/lib/authProvider';

interface ArtworkDetail {
  id: number;
  title: string;
  description?: string;
  category?: string | null;
  medium?: string | null;
  width_cm?: string | number | null;
  height_cm?: string | number | null;
  depth_cm?: string | number | null;
  creation_year?: number | null;
  price: string | number;
  is_available: boolean;
  status?: string;
  main_image?: string | null;
  additional_images?: string[] | null;
  artist?: {
    id: number;
    username?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
  views?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
}

export default function ArtworkDetailPage({ params }: { params: any }) {
  const router = useRouter();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artworkId, setArtworkId] = useState<number | null>(null);

  // Unwrap params if it's a Promise (Next.js 15+)
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      const { id } = resolvedParams || {};
      if (id) {
        setArtworkId(Number(id));
      } else {
        setError("Artwork ID not found");
        setLoading(false);
      }
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!artworkId) return;

    const fetchArtwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getArtwork(artworkId);
        setArtwork(data);
      } catch (err: any) {
        console.error("Failed to fetch artwork:", err);
        setError(err.response?.data?.message || err.message || "Failed to load artwork");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artworkId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading artwork details...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-200 mb-4">{error || "Artwork not found."}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const artistName = artwork.artist 
    ? `${artwork.artist.first_name || ''} ${artwork.artist.last_name || ''}`.trim() || artwork.artist.username
    : 'Unknown Artist';

  const dimensions = [artwork.width_cm, artwork.height_cm, artwork.depth_cm]
    .filter(Boolean)
    .map(d => `${d} cm`)
    .join(' × ') || 'Not specified';

  const statusConfig = {
    approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20' },
    pending: { label: 'Pending Review', icon: Clock, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20' },
    submitted: { label: 'Submitted', icon: Clock, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20' },
    draft: { label: 'Draft', icon: Edit2, color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20' },
  };

  const currentStatus = statusConfig[artwork.status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Artworks</span>
        </button>
        
        {user?.role === 'artist' && (
          <button
            onClick={() => router.push(`/dashboard/artworks?edit=${artwork.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Artwork
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            {artwork.main_image ? (
              <Image
                src={artwork.main_image}
                alt={artwork.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </div>

          {/* Additional Images */}
          {artwork.additional_images && artwork.additional_images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {artwork.additional_images.map((img, idx) => {
                let src = img;
                if (src && !src.startsWith('http') && !src.startsWith('/')) {
                  src = `https://hangart.pythonanywhere.com/media/artworks/images/${src}`;
                }
                return (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={src}
                      alt={`${artwork.title} - Image ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title & Status */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{artwork.title}</h1>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400">by {artistName}</span>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${currentStatus.color}`}>
                <currentStatus.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{currentStatus.label}</span>
              </div>
            </div>
          </div>

          {/* Price & Availability */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${Number(artwork.price).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Availability</span>
              <span className={`text-sm font-medium ${artwork.is_available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {artwork.is_available ? 'Available for Sale' : 'Not Available'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {artwork.description || 'No description available.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {artwork.category || 'Not specified'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {artwork.medium || 'Not specified'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Dimensions</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {dimensions}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Creation Year</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {artwork.creation_year || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{artwork.views || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{artwork.likes || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Created</span>
              <span className="text-gray-900 dark:text-gray-100">
                {artwork.created_at ? new Date(artwork.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {artwork.updated_at && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(artwork.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
