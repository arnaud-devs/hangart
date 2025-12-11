"use client";

import React from "react";
import Image from "next/image";


type RotatingArtworkProps = {
  src?: string;
  alt?: string;
};

// Lightweight 3D-style rotating artwork without external libs
export default function RotatingArtwork({ src = "public/arts/art3.jpeg", alt = "Artwork" }: RotatingArtworkProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 3D stage */}
        <div
          className="relative"
          style={{
            width: "75%",
            height: "75%",
            perspective: "1200px",
          }}
        >
          <div
            className="relative w-full h-full rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              animation: "rotateY360 18s linear infinite",
              backgroundColor: "rgba(255,255,255,0.72)",
            }}
          >
            {/* Artwork texture */}
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Subtle inner vignette for depth */}
            <div className="absolute inset-0 pointer-events-none" style={{
              boxShadow: "inset 0 0 120px rgba(0,0,0,0.25)",
            }} />
          </div>
        </div>
      </div>

      {/* Optional ground shadow ellipse */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-8 rounded-full bg-black/20 blur-sm" />

      <style jsx>{`
        @keyframes rotateY360 {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
