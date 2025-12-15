"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import ArtworkCard from "./ArtworkCard";
import { listArtworks } from "@/lib/appClient";

interface Artwork {
  id: number;
  title: string;
  artist_name?: string;
  main_image?: string | null;
  price?: string | number;
}

export default function HolidayCollection() {
  const { useI18n } = require('@/lib/i18nClient');
  const { t } = useI18n();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await listArtworks({ page: 1, ordering: "-created_at" });
        const artworksList = Array.isArray(response) ? response : response.results || [];
        
        // Shuffle and take first 12 artworks
        const shuffled = [...artworksList].sort(() => Math.random() - 0.5).slice(0, 12);
        setArtworks(shuffled);
      } catch (error) {
        console.error("Failed to fetch holiday collection:", error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const totalPages = Math.ceil(artworks.length / itemsPerPage);
  const currentArtworks = artworks.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-gray-100">
          {t('holiday.collection_title')}
        </h2>
        {!loading && artworks.length > itemsPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('prev_artworks')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('next_artworks')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">{t('holiday.loading')}</p>
          </div>
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t('holiday.none')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentArtworks.map((art) => (
            <ArtworkCard
              key={art.id}
              artwork={{
                id: art.id,
                title: art.title,
                artist: art.artist_name,
                image: art.main_image || undefined,
                price: String(art.price || ""),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
