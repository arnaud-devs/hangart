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
      const results: Artist[] = Array.isArray(data?.results) ? data.results : []
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
    <main className="min-h-[70vh] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Artists</h1>
          <Link href="/gallery" className="text-sm text-emerald-600">Back to Gallery</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 border rounded p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or bio" className="p-2 border rounded bg-white dark:bg-gray-700" />
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="p-2 border rounded bg-white dark:bg-gray-700" />
            <input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Specialization" className="p-2 border rounded bg-white dark:bg-gray-700" />
            <button onClick={() => fetchArtists(1)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">Search</button>
          </div>
        </div>

        {loading && <div className="text-sm text-gray-600">Loading…</div>}
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(a => (
            <Link key={String(a.id)} href={`/artists/${a.id}`} className="block group">
              <div className="border rounded overflow-hidden bg-white dark:bg-gray-800">
                <div className="h-40 bg-gray-100 dark:bg-gray-700">
                  {a.profile_photo ? (
                    <img src={a.profile_photo} alt={a.username || 'Artist'} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center text-sm text-gray-500">No photo</div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-semibold truncate">{a.username || `Artist #${a.id}`}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{a.specialization || '—'}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>{a.city || '—'}, {a.country || ''}</span>
                    {a.verified_by_admin && <span className="text-emerald-600">Verified</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && items.length === 0 && !error && (
          <div className="mt-6 text-sm text-gray-600">No artists found. Try adjusting filters.</div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Total: {count}</div>
          <div className="flex items-center gap-2">
            <button
              disabled={!previous || loading || page <= 1}
              onClick={() => fetchArtists(Math.max(1, page - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >Previous</button>
            <span className="text-sm">Page {page}</span>
            <button
              disabled={!next || loading}
              onClick={() => fetchArtists(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      </div>
    </main>
  )
}
