"use client";

import React, { useState } from 'react'
import sampleArtworks from '@/lib/sampleArtworks'
import { useRouter } from 'next/navigation'

export default function EditArtworkPage(props: any) {
  const { params } = props as { params: { id: string } };
  const router = useRouter();
  const art = sampleArtworks.find(a => a.id === params.id);
  const [title, setTitle] = useState(art?.title || '');
  const [price, setPrice] = useState(art?.price.toString() || '0');
  const [description, setDescription] = useState(art?.description || '');

  if (!art) return <div className="p-6">Artwork not found</div>;

  const save = () => {
    // In a real app you'd call an API to update. Here we just navigate back.
    console.log('save', { id: art.id, title, price, description });
    router.push('/dashboard/artworks');
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Artwork</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={5} />
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
            <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
