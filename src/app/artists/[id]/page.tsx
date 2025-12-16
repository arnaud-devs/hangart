"use client"

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { listArtworks } from '@/lib/appClient'
import { useParams } from 'next/navigation'
import { get } from '@/lib/appClient'
import Link from 'next/link'

export default function ArtistPublicPage() {
  const params = useParams() as { id?: string }
  const artistId = params?.id || ''
  interface ArtistProfile {
    id?: number;
    user_id?: number;
    username?: string;
    profile_photo?: string;
    specialization?: string;
    experience_years?: number;
    country?: string;
    city?: string;
    verified_by_admin?: boolean;
    bio?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter_x?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  }
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [artworks, setArtworks] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [artworksLoading, setArtworksLoading] = useState(false)

  const cancelRef = useRef(false)
  useEffect(() => {
    cancelRef.current = false;
    (async () => {
      try {
        setLoading(true);
        // Always fetch by artistId (which is the user_id)
        const data = await get(`/profiles/artist/${artistId}/`);
        if (cancelRef.current) return;
        setProfile(data);
        setArtworksLoading(true);
        // Use artist_id param for artworks
        const artworksRes = await listArtworks({ artist_id: artistId });
        const artworksList = Array.isArray(artworksRes) ? artworksRes : artworksRes.results || [];
        // Filter artworks on frontend by artist_name matching profile.username
        let filteredArtworks = artworksList;
        if (data && data.username) {
          filteredArtworks = artworksList.filter(
            (art: any) => String(art.artist_name).toLowerCase() === String(data.username).toLowerCase()
          );
        }
        setArtworks(filteredArtworks);
      } catch (e: any) {
        if (cancelRef.current) return;
        setError(String(e?.message ?? e));
      } finally {
        if (!cancelRef.current) setLoading(false);
        setArtworksLoading(false);
      }
    })();
    return () => { cancelRef.current = true; };
  }, [artistId]);

  return (
    <main className="min-h-[70vh] px-4 py-8 w-full">
      <div className="w-full mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Artist Profile</h1>
          <Link href="/gallery" className="text-sm text-emerald-600">Back to Gallery</Link>
        </div>

        {loading && <div className="text-sm text-gray-600">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {profile && (
          <section className="w-ful mx-auto bg-white dark:bg-gray-900 border border-yellow-100 dark:border-gray-800 rounded-2xl shadow p-8 flex flex-col items-center">
            <div className="flex flex-col md:flex-row w-full gap-8 items-center md:items-start">
              <div className="flex flex-col items-center md:items-start md:w-1/3">
                {profile.profile_photo ? (
                  <img src={profile.profile_photo} alt={profile.username || 'Artist'} className="w-32 h-32 rounded-full object-cover border-2 border-yellow-300 dark:border-yellow-700 shadow" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-yellow-100 dark:bg-gray-700 flex items-center justify-center text-5xl text-yellow-700 dark:text-gray-300 font-bold">
                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 text-center md:text-left">{profile.username || `Artist #${profile.user_id ?? ''}`}</h2>
                {profile.verified_by_admin && (
                  <span className="mt-2 bg-yellow-600 text-white text-xs px-4 py-1 rounded-full font-bold tracking-wide">Verified</span>
                )}
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 font-semibold">{profile.specialization || 'Specialization unknown'}</div>
                {typeof profile.experience_years !== 'undefined' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{profile.experience_years} yrs experience</div>
                )}
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                  {profile.country && <div><span className="font-medium">Country:</span> {profile.country}</div>}
                  {profile.city && <div><span className="font-medium">City:</span> {profile.city}</div>}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">Website</a>}
                  {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">Instagram</a>}
                  {profile.facebook && <a href={profile.facebook} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">Facebook</a>}
                  {profile.twitter_x && <a href={profile.twitter_x} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">Twitter</a>}
                  {profile.youtube && <a href={profile.youtube} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">YouTube</a>}
                  {profile.tiktok && <a href={profile.tiktok} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">TikTok</a>}
                  {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline text-xs">LinkedIn</a>}
                </div>
              </div>
            </div>
            <div className="w-full mt-8">
              <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">About</h2>
              <p className="text-base text-gray-700 dark:text-gray-200 whitespace-pre-line mb-6">{profile.bio || 'No bio provided.'}</p>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Artworks by {profile.username || `Artist #${profile.user_id ?? ''}`}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{artworks.length} artwork{artworks.length === 1 ? '' : 's'}</span>
              </div>
              {artworksLoading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading artworks…</div>
              ) : artworks.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No artworks found for this artist.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artworks.map((artwork) => (
                    <Link
                      key={artwork.id}
                      href={`/artworks/${artwork.id}`}
                      className="group relative bg-white dark:bg-white/5 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={artwork.main_image || '/placeholder-art.png'}
                          alt={artwork.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{artwork.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-yellow-600 dark:text-yellow-600">${artwork.price}</span>
                          {artwork.category && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{artwork.category}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
