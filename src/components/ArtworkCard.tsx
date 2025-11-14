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
};


export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const imageSrc = artwork.image || "/placeholder-art.png";

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
