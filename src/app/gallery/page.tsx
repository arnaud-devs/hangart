"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, SlidersHorizontal, Heart, Loader, Search } from "lucide-react";
import { listArtworks } from "@/lib/appClient";
import { useRouter } from 'next/navigation';
import VoiceRecognitionDynamic from './VoiceRecognitionDynamic';

type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

type ArtworkItem = {
  id: number;
  title: string;
  artist_name?: string;
  price?: string | number;
  main_image?: string | null;
  category?: string | null;
  medium?: string | null;
};

export default function GalleryPage() {
  const { t } = require('@/lib/i18nClient').useI18n();
  const router = useRouter();
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMedium, setSelectedMedium] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<FilterOption[]>([{ id: "all", label: "All" }]);
  const [mediums, setMediums] = useState<FilterOption[]>([]);
  const [artists, setArtists] = useState<FilterOption[]>([{ id: "all", label: "All Artists" }]);

  const priceRanges = [
    { id: "all", label: "All Prices", min: undefined, max: undefined },
    { id: "0-100", label: "Under $100", min: 0, max: 100 },
    { id: "100-500", label: "$100 - $500", min: 100, max: 500 },
    { id: "500-1000", label: "$500 - $1,000", min: 500, max: 1000 },
    { id: "1000-5000", label: "$1,000 - $5,000", min: 1000, max: 5000 },
    { id: "5000+", label: "$5,000+", min: 5000, max: undefined },
  ];

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    medium: true,
    artist: true,
    sort: true,
    price: true,
  });

  // Handler for voice filter intent with useCallback to prevent recreation
const handleVoiceFilter = useCallback((filterType: string, value: string) => {
  console.log('[GalleryPage] handleVoiceFilter CALLED!', { filterType, value });
  
  // Reset to page 1 for new filters
  setPage(1);
  
  switch (filterType) {
    case "category": {
      // Capitalize first letter to match category ids
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
      console.log('[GalleryPage] Setting category to:', capitalized, '(original:', value, ')');
      setSelectedCategory(capitalized);
      break;
    }
      
    case "medium":
      console.log('[GalleryPage] Setting medium to:', value);
      setSelectedMedium([value]);
      break;
      
    case "artist":
      console.log('[GalleryPage] Setting artist to:', value);
      setSelectedArtist(value);
      break;
      
    case "price":
      console.log('[GalleryPage] Setting price range to:', value);
      // Map voice price values to UI price range ids
      let priceId = "all";
      const priceValue = value.toLowerCase();
      
      if (priceValue === 'under-100') priceId = '0-100';
      else if (priceValue === '100-500') priceId = '100-500';
      else if (priceValue === '500-1000') priceId = '500-1000';
      else if (priceValue === '1000-5000') priceId = '1000-5000';
      else if (priceValue === '5000+') priceId = '5000+';
      else if (priceValue.includes('under')) priceId = '0-100';
      else if (priceValue.includes('100-500') || priceValue.includes('100 to 500')) priceId = '100-500';
      else if (priceValue.includes('500-1000') || priceValue.includes('500 to 1000')) priceId = '500-1000';
      else if (priceValue.includes('1000-5000') || priceValue.includes('1000 to 5000')) priceId = '1000-5000';
      else if (priceValue.includes('5000+') || priceValue.includes('over')) priceId = '5000+';
      
      console.log('[GalleryPage] Mapped price:', value, '->', priceId);
      setSelectedPriceRange(priceId);
      break;
      
    default:
      console.warn('[GalleryPage] Unknown filter type:', filterType);
  }
}, []);

  // Handler for clearing filters via voice
  const handleClearFilters = useCallback((filterType?: string) => {
    console.log('[Voice Clear] Clearing filters:', filterType || 'all');
    
    if (!filterType) {
      // Clear all filters
      setSelectedCategory("all");
      setSelectedMedium([]);
      setSelectedArtist("all");
      setSelectedPriceRange("all");
      setSearchQuery("");
      setSortBy("-created_at");
      setPage(1);
    } else {
      // Clear specific filter
      switch (filterType) {
        case "category":
          setSelectedCategory("all");
          break;
        case "medium":
          setSelectedMedium([]);
          break;
        case "artist":
          setSelectedArtist("all");
          break;
        case "price":
          setSelectedPriceRange("all");
          break;
      }
    }
    setPage(1);
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (filterArray: string[], setFilter: (val: string[]) => void, id: string) => {
    if (filterArray.includes(id)) {
      setFilter(filterArray.filter((item) => item !== id));
    } else {
      setFilter([...filterArray, id]);
    }
  };

  // Fetch artworks
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: page,
          ordering: sortBy,
        };

        if (selectedCategory !== "all") params.category = selectedCategory;
        if (selectedMedium.length > 0) params.medium = selectedMedium[0];
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const response = await listArtworks(params);
        const artworksList = Array.isArray(response) ? response : response.results || [];
        const count = Array.isArray(response) ? response.length : response.count || 0;

        setArtworks(artworksList);
        setTotalCount(count);

        // Extract unique categories and mediums
        const uniqueCategories = Array.from(
          new Set(artworksList.map((a: any) => a.category).filter(Boolean))
        ) as string[];
        const uniqueMediums = Array.from(
          new Set(artworksList.map((a: any) => a.medium).filter(Boolean))
        ) as string[];
        const uniqueArtists = Array.from(
          new Set(artworksList.map((a: any) => a.artist_name).filter(Boolean))
        ) as string[];

        setCategories([
          { id: "all", label: "All", count: count },
          ...uniqueCategories.map((cat) => ({ id: cat, label: cat })),
        ]);
        setMediums(uniqueMediums.map((med) => ({ id: med, label: med })));
        setArtists([
          { id: "all", label: "All Artists" },
          ...uniqueArtists.map((artist) => ({ id: artist, label: artist })),
        ]);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [page, selectedCategory, selectedMedium, sortBy, searchQuery]);


  // Client-side artist & price filtering
  const filteredArtworks = artworks.filter((artwork) => {
    if (selectedArtist !== "all" && artwork.artist_name !== selectedArtist) return false;

    if (selectedPriceRange === "all") return true;
    
    const range = priceRanges.find(r => r.id === selectedPriceRange);
    if (!range) return true;
    
    const price = typeof artwork.price === 'string' 
      ? parseFloat(artwork.price.replace(/[^0-9.]/g, '')) 
      : artwork.price || 0;
    
    if (range.min !== undefined && price < range.min) return false;
    if (range.max !== undefined && price > range.max) return false;
    
    return true;
  });

  // Debug: Log filteredArtworks after a voice filter is applied
  useEffect(() => {
    // Only log when a filter changes (not on every render)
    console.log('[GalleryPage] Filtered artworks after filter change:', {
      selectedCategory,
      selectedMedium,
      selectedArtist,
      selectedPriceRange,
      filteredArtworks
    });
  }, [selectedCategory, selectedMedium, selectedArtist, selectedPriceRange, filteredArtworks]);

  const activeFiltersCount = (selectedCategory !== "all" ? 1 : 0) + selectedMedium.length + (selectedArtist !== "all" ? 1 : 0) + (selectedPriceRange !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);
  const totalPages = Math.ceil(totalCount / 20);

  console.log('[GalleryPage] handleVoiceFilter function:', handleVoiceFilter);
  console.log('[GalleryPage] handleClearFilters function:', handleClearFilters);
  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-black py-8">
      {/* Voice recognition floating button for filter intent */}
      <VoiceRecognitionDynamic
        onFilterIntent={handleVoiceFilter}
        onClearFilters={handleClearFilters}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('gallery.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('gallery.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {filtersVisible ? "HIDE FILTERS" : "SHOW FILTERS"}
            </button>
          </div>

          {/* Sidebar filters */}
          <aside className={`${filtersVisible ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
            <div className="lg:sticky lg:top-4">
              {/* Hide filters button - desktop only */}
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {filtersVisible
                  ? `HIDE FILTERS${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}`
                  : "SHOW FILTERS"}
              </button>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  SEARCH
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search artworks..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:bg-white/5 rounded-md bg-white  text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("sort")}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  SORT
                  {expandedSections.sort ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.sort && (
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-white/5 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="price">Price: Low to High</option>
                    <option value="title">Title: A to Z</option>
                  </select>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  CATEGORY
                  {expandedSections.category ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => {
                            setSelectedCategory(cat.id);
                            setPage(1);
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {cat.label}
                        </span>
                        {cat.count !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            ({cat.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Medium */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("medium")}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  MEDIUM
                  {expandedSections.medium ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.medium && (
                  <div className="space-y-2">
                    {mediums.map((medium) => (
                      <label key={medium.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedMedium.includes(medium.id)}
                          onChange={() => {
                            toggleFilter(selectedMedium, setSelectedMedium, medium.id);
                            setPage(1);
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {medium.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Artist */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("artist")}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ARTIST
                  {expandedSections.artist ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.artist && (
                  <div className="space-y-2">
                    {artists.map((artist) => (
                      <label key={artist.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="artist"
                          checked={selectedArtist === artist.id}
                          onChange={() => {
                            setSelectedArtist(artist.id);
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {artist.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  PRICE RANGE
                  {expandedSections.price ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.price && (
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange === range.id}
                          onChange={() => {
                            setSelectedPriceRange(range.id);
                            setPage(1);
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? "Loading..." : `${filteredArtworks.length} artworks${selectedPriceRange !== "all" ? ` (filtered by price)` : ""}`}
              </p>
            </div>

            {/* Artworks grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400">Loading artworks...</p>
                </div>
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No artworks found in this price range.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedMedium([]);
                    setSelectedArtist("all");
                    setSelectedPriceRange("all");
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtworks.map((artwork) => (
                    <Link
                      key={artwork.id}
                      href={`/artworks/${artwork.id}`}
                      className="group relative bg-white dark:bg-white/5 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={artwork.main_image || "/placeholder-art.png"}
                          alt={artwork.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to wishlist functionality
                          }}
                          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {artwork.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {artwork.artist_name || "Unknown Artist"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-yellow-600 dark:text-yellow-600">
                            ${artwork.price}
                          </span>
                          {artwork.category && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {artwork.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}