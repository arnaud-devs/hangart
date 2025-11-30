"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getPublicArtistProfile } from '@/lib/authClient'
import Link from 'next/link'

export default function ArtistPublicPage() {
  const params = useParams() as { id?: string }
  const userId = params?.id || ''
  interface ArtistProfile {
    username?: string
    profile_photo?: string
    specialization?: string
    experience_years?: number
    country?: string
    city?: string
    verified_by_admin?: boolean
    bio?: string
    website?: string
    instagram?: string
    facebook?: string
    twitter_x?: string
    youtube?: string
    tiktok?: string
    linkedin?: string
  }
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const cancelRef = useRef(false)
  useEffect(() => {
    cancelRef.current = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await getPublicArtistProfile(userId)
        if (cancelRef.current) return
        setProfile(data)
      } catch (e: any) {
        if (cancelRef.current) return
        setError(String(e?.message ?? e))
      } finally {
        if (!cancelRef.current) setLoading(false)
      }
    })()
    return () => { cancelRef.current = true }
  }, [userId])

  return (
    <main className="min-h-[70vh] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Artist Profile</h1>
          <Link href="/gallery" className="text-sm text-emerald-600">Back to Gallery</Link>
        </div>

        {loading && <div className="text-sm text-gray-600">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white dark:bg-gray-800 border rounded p-4">
              {profile.profile_photo && (
                <img src={profile.profile_photo} alt={profile.username || 'Artist'} className="w-full h-48 object-cover rounded" />
              )}
              <div className="mt-4 space-y-1 text-sm">
                {profile.username && <div><span className="font-medium">Username:</span> {profile.username}</div>}
                {profile.specialization && <div><span className="font-medium">Specialization:</span> {profile.specialization}</div>}
                {typeof profile.experience_years !== 'undefined' && (
                  <div><span className="font-medium">Experience:</span> {profile.experience_years} years</div>
                )}
                {profile.country && <div><span className="font-medium">Country:</span> {profile.country}</div>}
                {profile.city && <div><span className="font-medium">City:</span> {profile.city}</div>}
                {typeof profile.verified_by_admin !== 'undefined' && (
                  <div><span className="font-medium">Verified:</span> {profile.verified_by_admin ? 'Yes' : 'No'}</div>
                )}
              </div>
              <div className="mt-4 space-y-1 text-sm">
                {profile.website && <div><span className="font-medium">Website:</span> <a href={profile.website} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.website}</a></div>}
                {profile.instagram && <div><span className="font-medium">Instagram:</span> <a href={profile.instagram} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.instagram}</a></div>}
                {profile.facebook && <div><span className="font-medium">Facebook:</span> <a href={profile.facebook} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.facebook}</a></div>}
                {profile.twitter_x && <div><span className="font-medium">Twitter/X:</span> <a href={profile.twitter_x} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.twitter_x}</a></div>}
                {profile.youtube && <div><span className="font-medium">YouTube:</span> <a href={profile.youtube} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.youtube}</a></div>}
                {profile.tiktok && <div><span className="font-medium">TikTok:</span> <a href={profile.tiktok} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.tiktok}</a></div>}
                {profile.linkedin && <div><span className="font-medium">LinkedIn:</span> <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-emerald-600">{profile.linkedin}</a></div>}
              </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-gray-800 border rounded p-4">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">{profile.bio || 'No bio provided.'}</p>
              {/* Placeholder for portfolio/artworks if available via another endpoint */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Portfolio</h3>
                <p className="text-sm text-gray-600">Coming soon — artworks listed here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
