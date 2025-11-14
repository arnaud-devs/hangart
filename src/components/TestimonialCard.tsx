'use client'
import React from 'react'
import { Star } from 'lucide-react'

type TestimonialCardProps = {
  name: string
  role?: string
  location?: string
  rating: number
  comment: string
  image?: string
}

export default function TestimonialCard({
  name,
  role,
  location,
  rating,
  comment,
  image,
}: TestimonialCardProps) {
  return (
    <div className="bg-[#F6F6F7] dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Rating stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
        "{comment}"
      </p>

      {/* Author info */}
      <div className="flex items-center gap-3">
        {image && (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!image && (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {name}
          </p>
          {(role || location) && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role && location ? `${role}, ${location}` : role || location}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
