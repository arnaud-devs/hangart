"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import Carousel from "@/components/Carousel";
import AddToCartButton from '@/components/AddToCartButton';
import { getArtwork, listArtworks } from "@/lib/appClient";

type ArtworkDetail = {
  id: number;
  title: string;
  artist: {
    id: number;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
  };
  slug?: string;
  description?: string;
  category?: string | null;
  medium?: string | null;
  width_cm?: string | number | null;
  height_cm?: string | number | null;
  depth_cm?: string | number | null;
  creation_year?: number | null;
  price: string | number;
  is_available: boolean;
  main_image?: string | null;
  additional_images?: string[] | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type RelatedArtwork = {
  id: number;
  title: string;
  artist_name?: string;
  artist_id?: number;
  main_image?: string | null;
  price?: string | number;
};

export default function ArtworkPage({ params }: { params: any }) {
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<RelatedArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artworkId, setArtworkId] = useState<number | null>(null);

  // Unwrap params if it's a Promise (Next.js 15+)
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      const { id } = resolvedParams || {};
      if (id) {
        setArtworkId(Number(id));
      } else {
        setError("Artwork ID not found");
        setLoading(false);
      }
    };
    unwrapParams();
  }, [params]);

  // Fetch artwork details
  useEffect(() => {
    if (!artworkId) return;

    const fetchArtwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getArtwork(artworkId);
        setArtwork(data);

        // Fetch related artworks by same artist
        if (data.artist?.id) {
          const relatedResponse = await listArtworks({ artist: data.artist.id });
          const relatedList = Array.isArray(relatedResponse) ? relatedResponse : relatedResponse.results || [];
          // Filter out current artwork
          const filtered = relatedList.filter((art: any) => art.id !== artworkId).slice(0, 4);
          setRelatedArtworks(filtered);
        }
      } catch (err: any) {
        console.error("Failed to fetch artwork:", err);
        setError(err.response?.data?.message || err.message || "Failed to load artwork");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artworkId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-red-600 dark:text-red-400">{error || "Artwork not found."}</p>
        <div className="text-center mt-4">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const artistName = `${artwork.artist.first_name} ${artwork.artist.last_name}`.trim() || artwork.artist.username;
  const dimensions = [artwork.width_cm, artwork.height_cm, artwork.depth_cm]
    .filter(Boolean)
    .map(d => `${d} cm`)
    .join(' × ') || '-';

  // Build carousel images from related artworks
  const carouselImages = relatedArtworks
    .map((art) => art.main_image)
    .filter(Boolean) as string[];

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Large image */}
        <div className="w-full">
          <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={artwork.main_image || "/placeholder-art.png"}
              alt={artwork.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Additional Images */}
          {artwork.additional_images && artwork.additional_images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {artwork.additional_images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={img}
                    alt={`${artwork.title} - Image ${idx + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{artwork.title}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            By{' '}
            <Link href={`/artist/${artwork.artist.id}`} className="text-yellow-600 dark:text-yellow-400 hover:underline">
              {artistName}
            </Link>
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <dt className="font-medium">Year</dt>
              <dd>{artwork.creation_year ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium">Medium</dt>
              <dd>{artwork.medium ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium">Dimensions</dt>
              <dd>{dimensions}</dd>
            </div>
            <div>
              <dt className="font-medium">Category</dt>
              <dd>{artwork.category ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium">Price</dt>
              <dd className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                ${artwork.price}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Availability</dt>
              <dd>
                {artwork.is_available ? (
                  <span className="text-green-600 dark:text-green-400">Available</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Sold</span>
                )}
              </dd>
            </div>
          </dl>

          {artwork.is_available && (
            <div className="mt-6">
              <AddToCartButton
                id={artwork.id}
                title={artwork.title}
                artistName={artistName}
                image={artwork.main_image || undefined}
                price={artwork.price}
                currency="$"
              />
            </div>
          )}

          {/* Accessible accordion using native <details> */}
          <div className="mt-8 space-y-4">
            <details className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700" aria-label="Description">
              <summary className="font-medium cursor-pointer">Description</summary>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {artwork.description || 'No description available.'}
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700" aria-label="Shipping and returns">
              <summary className="font-medium cursor-pointer">Shipping &amp; Returns</summary>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Free shipping on orders over $500. Returns accepted within 14 days of delivery.
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700" aria-label="About the artist">
              <summary className="font-medium cursor-pointer">About the Artist</summary>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Learn more about {artistName} by visiting their{' '}
                <Link href={`/artist/${artwork.artist.id}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  artist profile
                </Link>.
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related carousel */}
      {carouselImages.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">More from {artistName}</h2>
          <div className="mt-4">
            <Carousel images={carouselImages} />
          </div>
        </section>
      )}
    </main>
  );
}
