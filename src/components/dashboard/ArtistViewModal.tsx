// components/dashboard/ArtistViewModal.tsx
"use client";

import React from 'react';
import Modal from '@/components/ui/Modal';

interface Artist {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    is_verified: boolean;
  };
  bio?: string;
  profile_photo?: string;
  specialization?: string;
  experience_years: number;
  country?: string;
  city?: string;
  verified_by_admin: boolean;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter_x?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

interface Props {
  artist: Artist | null;
  onClose: () => void;
}

export default function ArtistViewModal({ artist, onClose }: Props) {
  if (!artist) return null;

  const socialLinks = [
    { name: 'Website', url: artist.website },
    { name: 'Instagram', url: artist.instagram },
    { name: 'Facebook', url: artist.facebook },
    { name: 'Twitter/X', url: artist.twitter_x },
    { name: 'YouTube', url: artist.youtube },
    { name: 'TikTok', url: artist.tiktok },
    { name: 'LinkedIn', url: artist.linkedin },
  ].filter(link => link.url);

  return (
    <Modal open={!!artist} onClose={onClose} title="Artist Details">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="flex items-start space-x-4">
          <img
            src={artist.profile_photo || '/avatars/default.jpg'}
            alt={artist.user.username}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {artist.user.first_name} {artist.user.last_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              @{artist.user.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {artist.user.email}
            </p>
            {artist.user.phone && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {artist.user.phone}
              </p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                artist.verified_by_admin
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              }`}
            >
              {artist.verified_by_admin ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>

        {/* Location & Specialization */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Location
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {artist.city && artist.country 
                ? `${artist.city}, ${artist.country}`
                : 'Not specified'
              }
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Specialization
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {artist.specialization || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Experience
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {artist.experience_years} years
          </p>
        </div>

        {/* Bio */}
        {artist.bio && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Biography
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {artist.bio}
            </p>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Social Links
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}