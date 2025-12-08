"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { listArtworks } from "@/lib/appClient";

type Props = {
  images?: string[];
  aspect?: string; // Tailwind aspect ratio class, e.g., 'aspect-[3/4]'
  autoPlay?: boolean;
  interval?: number;
  useRealArtworks?: boolean;
  limit?: number;
};

export default function Carousel({ 
  images = [], 
  aspect = "", 
  autoPlay = true, 
  interval = 6000,
  useRealArtworks = false,
  limit = 10
}: Props) {
  const [displayImages, setDisplayImages] = useState<string[]>(
    useRealArtworks ? ["/arts/art1.jpeg", "/arts/art2.jpeg", "/arts/art3.jpeg"] : images
  );
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const hoverRef = useRef(false);

  // Fetch real artworks if enabled
  useEffect(() => {
    if (!useRealArtworks) {
      setDisplayImages(images);
      setLoading(false);
      return;
    }

    const fetchArtworks = async () => {
      try {
        const response = await listArtworks({ page: 1, ordering: "-created_at" });
        const artworksList = Array.isArray(response) ? response : response.results || [];
        
        // Extract images and shuffle them
        const artworkImages = artworksList
          .map((art: any) => art.main_image)
          .filter(Boolean)
          .slice(0, limit);
        
        // Shuffle array
        const shuffled = [...artworkImages].sort(() => Math.random() - 0.5);
        setDisplayImages(shuffled);
      } catch (error) {
        console.error("Failed to fetch artworks for carousel:", error);
        // Use fallback images if provided
        setDisplayImages(images.length > 0 ? images : ["/arts/art1.jpeg", "/arts/art2.jpeg", "/arts/art3.jpeg"]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [useRealArtworks, limit, images]);

  useEffect(() => {
    if (!autoPlay || displayImages.length <= 1) return;

    function start() {
      stop();
      timerRef.current = window.setInterval(() => {
        if (!hoverRef.current) {
          setIndex((i) => {
            // Get next random index different from current
            let nextIndex;
            do {
              nextIndex = Math.floor(Math.random() * displayImages.length);
            } while (nextIndex === i && displayImages.length > 1);
            return nextIndex;
          });
        }
      }, interval);
    }

    function stop() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    start();
    return () => stop();
  }, [autoPlay, displayImages.length, interval]);

  function prev() {
    setIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  }

  function next() {
    setIndex((i) => (i + 1) % displayImages.length);
  }

  return (
    <div
      className={`relative w-full h-full p-4  ${aspect}`}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div className="relative w-full h-full ">
        {displayImages.map((src, i) => (
          <div
            key={src + i}
            className={`absolute rounded-2xl inset-0 transition-opacity duration-500 ${i === index ? "opacity-100 z-20" : "opacity-0 pointer-events-none z-10"}`}
          >
            <Image
              src={src}
              alt={`slide-${i}`}
              fill
              className="object-cover rounded-2xl"
              loading={i === 0 ? 'eager' : 'lazy'}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* Controls (moved to bottom) */}

      {/* Indicators (moved to bottom) */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1  flex items-center gap-2  py-2">
        {displayImages.map((_, i) => (
          <button
            suppressHydrationWarning
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "dark:bg-white bg-gray-800" : "bg-gray-400  dark:bg-white/60 "}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
