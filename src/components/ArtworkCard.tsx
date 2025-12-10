import React from "react";
import Image from "next/image";
import Link from "next/link";

export type Artwork = {
  id: string | number;
  title: string;
  artist?: string;
  image?: string;
  category?: string;
  currency?: string;
  price?: string;
  status?: string;
};


export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const imageSrc = artwork.image || "/placeholder-art.png";

  function StatusBadge({ status }: { status?: string }) {
    if (status === 'sold') return <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium">Sold</span>;
    if (status === 'approved') return <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Approved</span>;
    if (status === 'submitted') return <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium">Submitted</span>;
    if (status === 'draft') return <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-0.5 rounded text-xs font-medium">Draft</span>;
    if (status === 'rejected') return <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">Rejected</span>;
    if (status === 'archived') return <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">Archived</span>;
    return null;
  }

  return (
    <article className="bg-[#F6F6F7] dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <Link href={`/artworks/${artwork.id}`} className="block">
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
          <Image
            src={
              imageSrc
                ? (imageSrc.startsWith("/") || imageSrc.startsWith("http") ? imageSrc : `/artwork/${imageSrc}`)
                : "/placeholder-art.png"
            }
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
          {/* Status badge overlay */}
          {artwork.status && (
            <div className="absolute top-2 left-2 z-10">
              <StatusBadge status={artwork.status} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {artwork.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{artwork.artist || "Unknown"}</p>
          {artwork.price ? (
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{artwork.price}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
