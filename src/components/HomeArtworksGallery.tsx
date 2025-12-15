"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, Loader } from "lucide-react";
import ArtworkCard from "./ArtworkCard";
import { listArtworks } from "@/lib/appClient";

interface Artwork {
  id: number;
  title: string;
  artist_name: string;
  main_image: string;
  price: string;
  category?: string;
  medium?: string;
  artist_id?: number;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Artwork[];
}

export default function HomeArtworksGallery() {
  const { useI18n } = require('@/lib/i18nClient');
  const { t } = useI18n();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [mediums, setMediums] = useState<string[]>([]);

  // Fetch artworks
  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: page,
        ordering: sortBy,
      };

      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (mediumFilter) params.medium = mediumFilter;

      const response = await listArtworks(params);

      // Handle both array and paginated response
      if (Array.isArray(response)) {
        setArtworks(response as unknown as Artwork[]);
        setTotalCount(response.length);
      } else {
        setArtworks((response.results || []) as unknown as Artwork[]);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, [page, searchTerm, categoryFilter, mediumFilter, sortBy]);

  // Extract unique categories and mediums from artworks
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(artworks.map((a) => a.category).filter(Boolean))) as string[];
    const uniqueMediums = Array.from(new Set(artworks.map((a) => a.medium).filter(Boolean))) as string[];
    setCategories(uniqueCategories);
    setMediums(uniqueMediums);
  }, [artworks]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setMediumFilter("");
    setSortBy("-created_at");
    setPage(1);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold font-serif text-gray-900 dark:text-gray-100">{t('homeGallery.title')}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('homeGallery.subtitle')}</p>

      {/* Filters Section */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-white/5 dark:backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('homeGallery.search.placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('homeGallery.filters.category')}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">{t('homeGallery.filters.all_categories')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Medium Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('homeGallery.filters.medium')}
              </label>
              <select
                value={mediumFilter}
                onChange={(e) => {
                  setMediumFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">{t('homeGallery.filters.all_mediums')}</option>
                {mediums.map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('homeGallery.filters.sort_by')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="-created_at">{t('homeGallery.sort.newest_first')}</option>
                <option value="created_at">{t('homeGallery.sort.oldest_first')}</option>
                <option value="-price">{t('homeGallery.sort.price_high_low')}</option>
                <option value="price">{t('homeGallery.sort.price_low_high')}</option>
                <option value="title">{t('homeGallery.sort.title_a_z')}</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-white/10 dark:hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
              >
                {t('homeGallery.filters.reset')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        {loading ? t('homeGallery.loading') : t('homeGallery.results_count', { count: artworks.length, total: totalCount })}
      </div>

      {/* Artworks Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">{t('homeGallery.loading_artworks')}</p>
            </div>
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={{
                  id: art.id,
                  title: art.title,
                  artist: art.artist_name,
                  image: art.main_image,
                  price: art.price,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('homeGallery.no_results')}</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              {t('homeGallery.clear_filters')}
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalCount > 20 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('homeGallery.pagination.previous')}
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('homeGallery.pagination.page_of', { page, pages: Math.ceil(totalCount / 20) })}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(totalCount / 20)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('homeGallery.pagination.next')}
          </button>
        </div>
      )}
    </section>
  );
}
