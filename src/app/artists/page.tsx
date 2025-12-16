"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { get } from '@/lib/appClient'
import { useAuth } from '@/lib/authProvider'

type Artist = {
  id: number | string
  user_id: number
  username?: string
  profile_photo?: string
  specialization?: string
  experience_years?: number
  country?: string
  city?: string
  verified_by_admin?: boolean
  bio?: string
}

export default function ArtistsListPage() {
  const { user, loading: authLoading } = useAuth();
  const [q, setQ] = useState('')
  const [country, setCountry] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [items, setItems] = useState<Artist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)
  const [next, setNext] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (country) params.set('country', country)
    if (specialization) params.set('specialization', specialization)
    return params.toString()
  }, [q, country, specialization])

  async function fetchArtists(targetPage?: number) {
    try {
      setLoading(true); setError(null);
      const params: Record<string, any> = {};
      if (q) params.q = q;
      if (country) params.country = country;
      if (specialization) params.specialization = specialization;
      params.page = targetPage ?? page;
      // Use the real API endpoint and pass token via appClient
      const data = await get('/artists/', params);
      // Only show verified artists
      const results: Artist[] = (Array.isArray(data?.results) ? data.results : []).filter((a: Artist) => a.verified_by_admin);
      setItems(results);
      setCount(Number(data?.count ?? results.length ?? 0));
      setNext(data?.next ?? null);
      setPrevious(data?.previous ?? null);
      setPage(Number(targetPage ?? page));
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArtists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-[70vh] px-2 py-8 bg-gradient-to-br from-yellow-50 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <span className="inline-block w-2 h-8 bg-yellow-600 rounded-full mr-2" />
              Discover Artists
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1 text-sm">Browse and connect with admin-verified artists.</p>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium transition-colors text-sm">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline-block"><path d="M15 19l-7-7 7-7"/></svg>
            Back to Gallery
          </Link>
        </div>

        {/* Search/Filter Bar */}
        <div className="bg-white/90 dark:bg-gray-800/90 border border-yellow-100 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or bio" className="p-2 border border-yellow-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 rounded bg-white dark:bg-gray-700 transition" />
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="p-2 border border-yellow-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 rounded bg-white dark:bg-gray-700 transition" />
            <input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Specialization" className="p-2 border border-yellow-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 rounded bg-white dark:bg-gray-700 transition" />
            <button onClick={() => fetchArtists(1)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded shadow transition">Search</button>
          </div>
        </div>

        {loading && <div className="text-sm text-gray-600 dark:text-gray-300">Loading…</div>}
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map(a => (
            <Link
              key={String(a.id)}
              href={`/artists/${a.user_id}`}
              className="block group focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded-2xl transition-transform hover:-translate-y-1 hover:shadow-lg duration-150"
            >
              <div className="rounded-2xl shadow border border-yellow-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-full group focus-within:ring-2 focus-within:ring-yellow-600 relative">
                <div className="h-40 flex items-center justify-center relative bg-gray-50 dark:bg-gray-800">
                  {a.profile_photo ? (
                    <img
                      src={a.profile_photo}
                      alt={a.username || 'Artist'}
                      className="w-20 h-20 object-cover object-center rounded-full border-2 border-yellow-200 dark:border-gray-700 bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-gray-700 text-2xl text-yellow-700 dark:text-gray-300 font-bold">
                      {a.username ? a.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  {a.verified_by_admin && (
                    <span className="absolute top-3 right-3 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded font-bold shadow tracking-wide z-10">Verified</span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-base text-gray-900 dark:text-gray-100 truncate mb-1 flex items-center gap-2">
                    {a.username || `Artist #${a.id}`}
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium mb-1 truncate uppercase tracking-wide">
                    {a.specialization || <span className="opacity-60">Specialization unknown</span>}
                  </div>
                  {a.experience_years ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                      {a.experience_years} yrs experience
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mb-1">—</div>
                  )}
                  {a.bio && (
                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{a.bio}</div>
                  )}
                  <div className="mt-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{a.city || <span className="opacity-60">City</span>}</span>
                    {a.city && a.country && <span>•</span>}
                    <span>{a.country || <span className="opacity-60">Country</span>}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && items.length === 0 && !error && (
          <div className="mt-8 text-base text-gray-600 dark:text-gray-300 text-center">No artists found. Try adjusting filters.</div>
        )}

        {/* Pagination */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-yellow-100 dark:border-gray-700 pt-6">
          <div className="text-sm text-gray-600 dark:text-gray-300">Total: <span className="font-bold text-yellow-600">{count}</span></div>
          <div className="flex items-center gap-2">
            <button
              disabled={!previous || loading || page <= 1}
              onClick={() => fetchArtists(Math.max(1, page - 1))}
              className="px-4 py-2 border border-yellow-200 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >Previous</button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Page {page}</span>
            <button
              disabled={!next || loading}
              onClick={() => fetchArtists(page + 1)}
              className="px-4 py-2 border border-yellow-200 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        </div>
      </div>
    </main>
  )
}
