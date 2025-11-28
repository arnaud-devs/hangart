import React from 'react'
import sampleArtworks from '@/lib/sampleArtworks'
import Link from 'next/link'

export default function ArtworkPage(props: any) {
  const { params } = props as { params: { id: string } };
  const { id } = params;
  const art = sampleArtworks.find(a => a.id === id);

  if (!art) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">Artwork not found.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-6">
          <img src={art.image} alt={art.title} className="w-64 h-48 object-cover rounded" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{art.title}</h1>
            <div className="text-sm text-gray-500">by {art.artistName}</div>
            <p className="mt-4 text-gray-700">{art.description}</p>

            <div className="mt-4 flex items-center gap-3">
              <div className="text-lg font-semibold">{art.currency} {art.price.toFixed(2)}</div>
              <div>
                {art.status === 'approved' ? (
                  <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Approved</span>
                ) : art.status === 'pending' ? (
                  <span className="text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">Pending</span>
                ) : (
                  <span className="text-red-700 bg-red-50 px-3 py-1 rounded-full">Rejected</span>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {art.status !== 'approved' && (
                <Link href={`/dashboard/artworks/${art.id}/edit`} className="px-4 py-2 bg-emerald-600 text-white rounded">Edit</Link>
              )}
              <Link href="/dashboard/artworks" className="px-4 py-2 border rounded">Back</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
