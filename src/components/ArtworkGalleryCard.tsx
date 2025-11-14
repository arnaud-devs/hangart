'use client'
import React from 'react'
import Image from 'next/image'
import { Heart, Plus, ShoppingBag } from 'lucide-react'

type ArtworkGalleryCardProps = {
  id: string | number
  title: string
  artist: string
  location: string
  medium: string
  dimensions: string
  price: string
  image: string
}

export default function ArtworkGalleryCard({
  id,
  title,
  artist,
  location,
  medium,
  dimensions,
  price,
  image,
}: ArtworkGalleryCardProps) {
  return (
    <div className="group relative bg-[#F6F6F7] dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Image container with hover overlay */}
      <div className="relative aspect-4/3 bg-white dark:bg-gray-900 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Quick view"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {price}
            </h3>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
              {title}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
            <Plus className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
            <ShoppingBag className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {artist}, {location}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {medium}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {dimensions}
        </p>
      </div>
    </div>
  )
}
