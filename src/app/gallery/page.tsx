"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, SlidersHorizontal, Heart, Loader, Search } from "lucide-react";
import { listArtworks } from "@/lib/appClient";

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
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMedium, setSelectedMedium] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<FilterOption[]>([{ id: "all", label: "All" }]);
  const [mediums, setMediums] = useState<FilterOption[]>([]);

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
    sort: true,
    price: true,
  });

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
        if (selectedMedium.length > 0) params.medium = selectedMedium[0]; // API accepts single medium
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

        setCategories([
          { id: "all", label: "All", count: count },
          ...uniqueCategories.map((cat) => ({ id: cat, label: cat })),
        ]);
        setMediums(uniqueMediums.map((med) => ({ id: med, label: med })));
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };


    fetchArtworks();
  }, [page, selectedCategory, selectedMedium, sortBy, searchQuery]);

  // Client-side price filtering
  const filteredArtworks = artworks.filter((artwork) => {
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

  const activeFiltersCount = (selectedCategory !== "all" ? 1 : 0) + selectedMedium.length + (selectedPriceRange !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);
  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover unique artworks from talented artists around the world
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
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
                      className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
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
