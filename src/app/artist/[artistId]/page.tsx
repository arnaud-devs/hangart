import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid';
import sampleArtworks from '@/data/SampleArtworks';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://hangart.pythonanywhere.com/api';

export default async function ArtistPage({ params }: { params: any }) {
  const resolved = await params;
  const artistId = resolved?.artistId;
  if (!artistId) {
    return <div className="container mx-auto p-8">Artist not found.</div>;
  }

  // Fetch artist profile from backend API (server-side)
  let artist: any = null;
  try {
    const res = await fetch(`${API_BASE}/profiles/artists/${artistId}/`);
    if (res.ok) {
      artist = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch artist:', e);
  }

  if (!artist) return <div className="container mx-auto p-8">Artist not found.</div>;

  const { name, bio, avatarUrl, socialLinks, artworks } = artist as any;

  const galleryItems = (artworks || []).map((id: any) => {
    const a = sampleArtworks.find((s) => String(s.id) === String(id));
    return (
      a && {
        id: a.id,
        title: a.title,
        image: a.image,
        artistName: a.artistName,
        price: a.price,
        currency: a.currency,
      }
    );
  }).filter(Boolean) as any[];

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3">
          <div className="w-48 h-48 relative rounded-full overflow-hidden bg-gray-100">
            <Image src={avatarUrl || '/placeholder-avatar.png'} alt={name} fill className="object-cover" sizes="192px" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{name}</h1>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{bio}</p>

          {Array.isArray(socialLinks) && socialLinks.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((s: any) => (
                <Link key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {s.platform || s.type || s.url}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Artworks by {name}</h2>
        {/* GalleryGrid expects artworks data or will fetch; pass artworks if available */}
        <GalleryGrid artworks={galleryItems} />
      </section>
    </main>
  );
}
