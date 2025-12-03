// app/dashboard/artists/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { adminService, artistService } from '@/services/apiServices'; 
import VerifyArtistModal from '@/components/dashboard/VerifyArtistModal';
import { useAuth } from '@/lib/authProvider';
import ArtistViewModal from '@/components/dashboard/ArtistViewModal';
import ArtistEditModal from '@/components/dashboard/ArtistEditModal';

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
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewArtist, setViewArtist] = useState<Artist | null>(null);
  const [editArtist, setEditArtist] = useState<Artist | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<Artist | null>(null);
  // admins cannot create users — only verify; remove add artist UI
  const { user } = useAuth();

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      // Use the public artists listing exposed by the backend
      const response = await artistService.listArtists();
      setArtists(response.results || response || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load artists');
      console.error('Error loading artists:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (artistId: number) => {
    // deprecated: use modal-based verify flow
    setVerifyTarget(artists.find(a => a.id === artistId) || null);
  };

  const updateArtist = async (updatedArtist: Artist) => {
    try {
      // This would typically call an admin endpoint to update artist
      setArtists(prev => 
        prev.map(artist => 
          artist.id === updatedArtist.id ? updatedArtist : artist
        )
      );
      setEditArtist(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update artist');
    }
  };

  const addArtist = async (artistData: any) => {
    try {
      // This would typically call an admin endpoint to create artist
      // For now, we'll simulate adding
      const newArtist: Artist = {
        id: Date.now(),
        user: {
          id: Date.now(),
          username: artistData.username,
          email: artistData.email,
          first_name: artistData.first_name,
          last_name: artistData.last_name,
          phone: artistData.phone,
          is_verified: false,
        },
        bio: artistData.bio,
        specialization: artistData.specialization,
        experience_years: artistData.experience_years || 0,
        country: artistData.country,
        city: artistData.city,
        verified_by_admin: false,
      };
      setArtists(prev => [newArtist, ...prev]);
      // setShowAddArtist(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add artist');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading artists...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Artists Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Manage registered artists and their verification status
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <div className="text-sm text-gray-500">Admin: manage and verify artists from the Users page.</div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {artists.map((artist) => (
                  <tr key={artist.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={(artist as any).profile_photo || '/avatars/default.jpg'}
                            alt={(artist as any).user?.username || `artist-${artist.id}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {((artist as any).user?.first_name || (artist as any).user?.username || (artist as any).email || `Artist ${artist.id}`)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            @{(artist as any).user?.username || (artist as any).email || `artist-${artist.id}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {(artist as any).user?.email || (artist as any).email || 'No email'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {(artist as any).user?.phone || (artist as any).phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {((artist as any).city || (artist as any).country) ? `${(artist as any).city || ''}${(artist as any).city && (artist as any).country ? ', ' : ''}${(artist as any).country || ''}` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {(artist as any).specialization || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          artist.verified_by_admin
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}
                      >
                        {artist.verified_by_admin ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setViewArtist(artist)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditArtist(artist)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Edit
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => toggleVerification(artist.id)}
                            className={`${
                              artist.verified_by_admin
                                ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300'
                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                            }`}
                          >
                            {artist.verified_by_admin ? 'Unverify' : 'Verify'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {artists.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-300">
              No artists found
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewArtist && (
        <ArtistViewModal
          artist={viewArtist}
          onClose={() => setViewArtist(null)}
        />
      )}

      {editArtist && (
        <ArtistEditModal
          artist={editArtist}
          onClose={() => setEditArtist(null)}
          onSave={updateArtist}
        />
      )}

        {/* Admins cannot add artists directly; user registration is through public register endpoint. */}

      {verifyTarget && (
        <VerifyArtistModal
          artist={verifyTarget}
          onClose={() => setVerifyTarget(null)}
          onConfirm={async (verified: boolean, adminComment?: string) => {
            try {
              await adminService.verifyArtist(verifyTarget!.id, verified);
              setArtists(prev => prev.map(a => a.id === verifyTarget!.id ? { ...a, verified_by_admin: verified } : a));
            } catch (err: any) {
              setError(err.message || 'Failed to update verification');
            }
          }}
        />
      )}
    </div>
  );
}