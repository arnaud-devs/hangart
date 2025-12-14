"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Artist = {
  id: number | string
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
      setLoading(true); setError(null)
      const qp = new URLSearchParams(queryString)
      qp.set('page', String(targetPage ?? page))
      const res = await fetch(`/api/artists${qp.toString() ? `?${qp.toString()}` : ''}`)
      const data = await res.json()
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || 'Failed to load artists')
      }
      // Only show verified artists
      const results: Artist[] = (Array.isArray(data?.results) ? data.results : []).filter((a: Artist) => a.verified_by_admin)
      setItems(results)
      setCount(Number(data?.count ?? results.length ?? 0))
      setNext(data?.next ?? null)
      setPrevious(data?.previous ?? null)
      setPage(Number(targetPage ?? page))
    } catch (e: any) {
      setError(String(e?.message ?? e))
    } finally {
      setLoading(false)
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
            <Link key={String(a.id)} href={`/artists/${a.id}`} className="block group focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded-2xl transition-shadow">
              <div className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-gray-800 border border-yellow-100 dark:border-gray-700 overflow-hidden flex flex-col h-full group focus-within:ring-2 focus-within:ring-yellow-600">
                <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
                  {a.profile_photo ? (
                    <img src={a.profile_photo} alt={a.username || 'Artist'} className="w-full h-48 object-cover object-center transition-transform group-hover:scale-105 duration-200" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-lg text-gray-400 font-semibold">No photo</div>
                  )}
                  {a.verified_by_admin && (
                    <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg tracking-wide">Verified</span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-extrabold text-lg text-gray-900 dark:text-gray-100 truncate mb-1 flex items-center gap-2">
                    {a.username || `Artist #${a.id}`}
                  </div>
                  <div className="text-xs text-yellow-600 font-semibold mb-1 truncate uppercase tracking-wide">{a.specialization || '—'}</div>
                  {a.experience_years && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{a.experience_years} years experience</div>
                  )}
                  {a.bio && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{a.bio}</div>
                  )}
                  <div className="mt-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{a.city || '—'}</span>
                    {a.city && a.country && <span>•</span>}
                    <span>{a.country || ''}</span>
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
