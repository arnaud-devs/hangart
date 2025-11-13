import React from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import sampleArtworks from '@/data/SampleArtworks';

type ArtworkDetail = {
  id: string | number;
  title: string;
  artistName?: string;
  artistId?: string | number;
  image?: string;
  year?: string | number;
  medium?: string;
  size?: string;
  price?: string | number;
  currency?: string;
  description?: string;
  shipping?: string;
  artistBio?: string;
};

export default async function ArtworkPage({ params }: { params: any }) {
  // `params` may be a Promise in Next.js 16; unwrap it before accessing properties
  const resolvedParams = await params;
  const { id } = resolvedParams || {};
  if (!id) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-700 dark:text-gray-300">Artwork not found.</p>
      </div>
    );
  }

  // Use local sample dataset directly on the server to avoid internal fetch
  // URL parsing issues during development. This also makes the page faster
  // and deterministic in dev.
  const art = sampleArtworks.find((a) => String(a.id) === String(id)) as ArtworkDetail | undefined;

  if (!art) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-700 dark:text-gray-300">Artwork not found.</p>
      </div>
    );
  }

  // Related artworks by same artist (exclude current)
  const related = sampleArtworks.filter((a) => a.artistName === art.artistName && String(a.id) !== String(art.id)).slice(0, 4) as ArtworkDetail[];

  // Build image list for carousel (exclude current artwork)
  const carouselImages = (related || [])
    .filter((a) => String(a.id) !== String(art.id))
    .slice(0, 4)
    .map((a) => (a.image ? (a.image.startsWith("/") ? a.image : `/artwork/${a.image}`) : "/placeholder-art.png"));

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Large image */}
        <div className="w-full">
          <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={art.image ? (art.image.startsWith("/") || art.image.startsWith("http") ? art.image : `/artwork/${art.image}`) : "/placeholder-art.png"}
              alt={art.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="w-full">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{art.title}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            By{' '}
            {art.artistName ? (
              <Link href={`/artist/${encodeURIComponent(String(art.artistId ?? art.artistName))}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                {art.artistName}
              </Link>
            ) : (
              'Unknown'
            )}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <dt className="font-medium">Year</dt>
              <dd>{art.year ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium">Medium</dt>
              <dd>{art.medium ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium">Size</dt>
              <dd>{art.size ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium">Price</dt>
              <dd>{art.price ? `${art.currency ?? '$'}${art.price}` : 'Contact'}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              type="button"
              aria-label={`Add ${art.title} to cart`}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
            >
              Add to cart
            </button>
          </div>

          {/* Accessible accordion using native <details> */}
          <div className="mt-8 space-y-4">
            <details className="bg-white dark:bg-gray-800 p-4 rounded-md" aria-label="Description">
              <summary className="font-medium cursor-pointer">Description</summary>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{art.description ?? 'No description available.'}</div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-md" aria-label="Shipping and returns">
              <summary className="font-medium cursor-pointer">Shipping &amp; Returns</summary>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{art.shipping ?? 'Shipping and returns information is not available.'}</div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-md" aria-label="About the artist">
              <summary className="font-medium cursor-pointer">About the Artist</summary>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{art.artistBio ?? 'No artist information available.'}</div>
            </details>
          </div>
        </div>
      </div>

      {/* Related carousel */}
      {carouselImages.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">More from this Artist</h2>
          <div className="mt-4">
            {/* Carousel is a client component that accepts image urls */}
            <Carousel images={carouselImages} />
          </div>
        </section>
      )}
    </main>
  );
}
