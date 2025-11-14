"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  aspect?: string; // Tailwind aspect ratio class, e.g., 'aspect-[3/4]'
  autoPlay?: boolean;
  interval?: number;
};

export default function Carousel({ images, aspect = "", autoPlay = true, interval = 3000 }: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    function start() {
      stop();
      timerRef.current = window.setInterval(() => {
        if (!hoverRef.current) setIndex((i) => (i + 1) % images.length);
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
  }, [autoPlay, images.length, interval]);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div
      className={`relative w-full h-full p-4  ${aspect}`}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div className="relative w-full h-full ">
        {images.map((src, i) => (
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
        {images.map((_, i) => (
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
