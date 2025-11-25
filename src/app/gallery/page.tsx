"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, SlidersHorizontal, Heart, Plus, ShoppingBag } from 'lucide-react'

type FilterOption = {
  id: string
  label: string
  count?: number
}

type ArtworkItem = {
  id: string
  title: string
  artist: string
  price: string
  image: string
  category: string
  style?: string
  size?: string
}

const categories: FilterOption[] = [
  { id: 'all', label: 'All', count: 120 },
  { id: 'painting', label: 'Painting', count: 45 },
  { id: 'photography', label: 'Photography', count: 32 },
  { id: 'sculpture', label: 'Sculpture', count: 18 },
  { id: 'drawing', label: 'Drawing', count: 15 },
  { id: 'mixed-media', label: 'Mixed Media', count: 10 },
]

const styles: FilterOption[] = [
  { id: 'contemporary', label: 'Contemporary' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'abstract', label: 'Abstract' },
  { id: 'realism', label: 'Realism' },
  { id: 'impressionism', label: 'Impressionism' },
  { id: 'minimalism', label: 'Minimalism' },
  { id: 'expressionism', label: 'Expressionism' },
]

const sizes: FilterOption[] = [
  { id: 'small', label: 'Small (under 20")' },
  { id: 'medium', label: 'Medium (20-40")' },
  { id: 'large', label: 'Large (40-60")' },
  { id: 'xlarge', label: 'Extra Large (60"+)' },
]

const priceRanges: FilterOption[] = [
  { id: 'under-500', label: 'Under $500' },
  { id: '500-1000', label: '$500 - $1,000' },
  { id: '1000-2500', label: '$1,000 - $2,500' },
  { id: '2500-5000', label: '$2,500 - $5,000' },
  { id: 'over-5000', label: 'Over $5,000' },
]

const orientations: FilterOption[] = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'square', label: 'Square' },
]

const sampleArtworks: ArtworkItem[] = [
  {
    id: '1',
    title: 'Desert Dunes',
    artist: 'Sarah Johnson',
    price: '$740',
    image: '/arts/art1.jpeg',
    category: 'photography',
    style: 'documentary',
    size: 'large',
  },
  {
    id: '2',
    title: 'Urban Architecture',
    artist: 'Michael Chen',
    price: '$890',
    image: '/arts/art2.jpeg',
    category: 'photography',
    style: 'contemporary',
    size: 'medium',
  },
  {
    id: '3',
    title: 'City Rhythm',
    artist: 'David Kim',
    price: '$1,240',
    image: '/arts/art3.jpeg',
    category: 'photography',
    style: 'documentary',
    size: 'large',
  },
  {
    id: '4',
    title: 'Abstract Expressions',
    artist: 'Emma Rodriguez',
    price: '$2,350',
    image: '/arts/art4.jpeg',
    category: 'painting',
    style: 'abstract',
    size: 'xlarge',
  },
  {
    id: '5',
    title: 'Modern Portrait',
    artist: 'Sophie Martin',
    price: '$1,890',
    image: '/arts/art1.jpeg',
    category: 'painting',
    style: 'contemporary',
    size: 'medium',
  },
  {
    id: '6',
    title: 'Landscape Dreams',
    artist: 'James Wilson',
    price: '$3,200',
    image: '/arts/art2.jpeg',
    category: 'painting',
    style: 'impressionism',
    size: 'large',
  },
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [filtersVisible, setFiltersVisible] = useState(true)
  
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    style: true,
    size: true,
    price: true,
    orientation: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleFilter = (filterArray: string[], setFilter: (val: string[]) => void, id: string) => {
    if (filterArray.includes(id)) {
      setFilter(filterArray.filter(item => item !== id))
    } else {
      setFilter([...filterArray, id])
    }
  }

  // Filter artworks based on selected filters
  const filteredArtworks = sampleArtworks.filter(artwork => {
    // Category filter
    if (selectedCategory !== 'all' && artwork.category !== selectedCategory) {
      return false
    }

    // Style filter
    if (selectedStyles.length > 0 && artwork.style && !selectedStyles.includes(artwork.style)) {
      return false
    }

    // Size filter
    if (selectedSizes.length > 0 && artwork.size && !selectedSizes.includes(artwork.size)) {
      return false
    }

    // Price filter
    if (selectedPrices.length > 0) {
      const priceNum = parseFloat(artwork.price.replace(/[$,]/g, ''))
      let matchesPrice = false
      
      selectedPrices.forEach(range => {
        if (range === 'under-500' && priceNum < 500) matchesPrice = true
        if (range === '500-1000' && priceNum >= 500 && priceNum < 1000) matchesPrice = true
        if (range === '1000-2500' && priceNum >= 1000 && priceNum < 2500) matchesPrice = true
        if (range === '2500-5000' && priceNum >= 2500 && priceNum < 5000) matchesPrice = true
        if (range === 'over-5000' && priceNum >= 5000) matchesPrice = true
      })
      
      if (!matchesPrice) return false
    }

    return true
  })

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[$,]/g, ''))
    const priceB = parseFloat(b.price.replace(/[$,]/g, ''))

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB
      case 'price-high':
        return priceB - priceA
      case 'newest':
        return b.id.localeCompare(a.id)
      case 'popular':
        return a.title.localeCompare(b.title)
      default: // featured
        return 0
    }
  })

  // Count active filters
  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedStyles.length +
    selectedSizes.length +
    selectedPrices.length +
    selectedOrientations.length

  return (
    <div className="min-h-screen  ">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            <a href="/" className="hover:text-gray-900 dark:hover:text-gray-100">All Artworks</a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 dark:text-gray-100">
            Original Art For Sale
          </h1>
        </div>
      </div>

      {/* Category pills */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { label: 'PAINTINGS', image: '/arts/art1.jpeg', category: 'painting' },
              { label: 'PHOTOGRAPHY', image: '/arts/art2.jpeg', category: 'photography' },
              { label: 'SCULPTURE', image: '/arts/art3.jpeg', category: 'sculpture' },
              { label: 'DRAWINGS', image: '/arts/art4.jpeg', category: 'drawing' },
              { label: 'FINE ART PRINTS', image: '/arts/art1.jpeg', category: 'prints' },
              { label: 'ABSTRACT ART', image: '/arts/art2.jpeg', category: 'abstract' },
            ].map((item) => (
              <button
                key={item.category}
                suppressHydrationWarning
                onClick={() => setSelectedCategory(item.category)}
                className={`flex flex-col items-center gap-1 sm:gap-2 min-w-[90px] sm:min-w-[120px] group ${
                  selectedCategory === item.category ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-full aspect-3/2 rounded-lg overflow-hidden border-2 transition-colors" style={{
                  borderColor: selectedCategory === item.category ? '#3b82f6' : 'transparent'
                }}>
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={200}
                    height={133}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-gray-100 uppercase text-center leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden">
            <button
              suppressHydrationWarning
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {filtersVisible ? 'HIDE FILTERS' : 'SHOW FILTERS'}
            </button>
          </div>

          {/* Sidebar filters */}
          <aside className={`${filtersVisible ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
            <div className="lg:sticky lg:top-4">
              {/* Hide filters button - desktop only */}
              <button
                suppressHydrationWarning
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {filtersVisible ? `HIDE FILTERS${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}` : 'SHOW FILTERS'}
              </button>

              {/* Sort */}
              <div className="mb-6">
                <button
                  suppressHydrationWarning
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  SORT
                  {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.category && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <button
                  suppressHydrationWarning
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  CATEGORY
                  {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {cat.label}
                        </span>
                        {cat.count && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            ({cat.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Style */}
              <div className="mb-6">
                <button
                  suppressHydrationWarning
                  onClick={() => toggleSection('style')}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  STYLE
                  {expandedSections.style ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.style && (
                  <div className="space-y-2">
                    {styles.map((style) => (
                      <label key={style.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedStyles.includes(style.id)}
                          onChange={() => toggleFilter(selectedStyles, setSelectedStyles, style.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {style.label}
                        </span>
                      </label>
                    ))}
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      SHOW MORE
                    </button>
                  </div>
                )}
              </div>

              {/* Size */}
              <div className="mb-6">
                <button
                  suppressHydrationWarning
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  SIZE
                  {expandedSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.size && (
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label key={size.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size.id)}
                          onChange={() => toggleFilter(selectedSizes, setSelectedSizes, size.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {size.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <button
                  suppressHydrationWarning
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  PRICE
                  {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.price && (
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedPrices.includes(range.id)}
                          onChange={() => toggleFilter(selectedPrices, setSelectedPrices, range.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Orientation */}
              <div className="mb-6">
                <button
                  suppressHydrationWarning
                  onClick={() => toggleSection('orientation')}
                  className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  ORIENTATION
                  {expandedSections.orientation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.orientation && (
                  <div className="space-y-2">
                    {orientations.map((orientation) => (
                      <label key={orientation.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedOrientations.includes(orientation.id)}
                          onChange={() => toggleFilter(selectedOrientations, setSelectedOrientations, orientation.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          {orientation.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Artworks grid */}
          <main className="flex-1 w-full">
            {sortedArtworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No artworks found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedStyles([])
                    setSelectedSizes([])
                    setSelectedPrices([])
                    setSelectedOrientations([])
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {sortedArtworks.map((artwork) => (
                <div key={artwork.id} className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {artwork.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <button
                          suppressHydrationWarning
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          suppressHydrationWarning
                          className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          aria-label="Quick view"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          suppressHydrationWarning
                          className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {artwork.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 truncate">
                      {artwork.artist}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
