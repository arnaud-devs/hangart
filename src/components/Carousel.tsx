"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listArtworks } from "@/lib/appClient";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Award, Palette, Eye, Heart } from "lucide-react";

type Props = {
  images?: string[];
  aspect?: string;
  autoPlay?: boolean;
  interval?: number;
  useRealArtworks?: boolean;
  limit?: number;
};

interface ArtworkSlide {
  id: string;
  image: string;
  artist: string;
  title: string;
  price: number;
  featured?: boolean;
  discount?: number;
  views?: number;
}

export default function Carousel({ 
  images = [], 
  aspect = "", 
  autoPlay = true, 
  interval = 4000,
  useRealArtworks = false,
  limit = 10
}: Props) {
  const [slides, setSlides] = useState<ArtworkSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const slideIntervalRef = useRef<number | null>(null);

  // Fetch real artworks and create slides
  useEffect(() => {
    let mounted = true;
    
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        const response = await listArtworks({ page: 1, ordering: "-created_at" });
        const artworksList = Array.isArray(response) ? response : response.results || [];
        
        // Shuffle artworks randomly
        const shuffledArtworks = [...artworksList].sort(() => Math.random() - 0.5);
        
        const slideData: ArtworkSlide[] = shuffledArtworks.slice(0, limit).map((art: any, idx) => ({
          id: art.id || `artwork-${idx}`,
          image: art.main_image || art.image || "/arts/art1.jpeg",
          artist: art.artist_name || art.artist || "Featured Artist",
          title: art.title || art.name || "Untitled",
          price: Number(art.price) || Math.floor(Math.random() * 500) + 100,
          featured: idx === 0 || Math.random() > 0.7,
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
          views: Math.floor(Math.random() * 1000) + 100
        }));

        if (mounted) {
          setSlides(slideData.length > 0 ? slideData : createFallbackSlides());
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch artworks for carousel:", error);
        if (mounted) {
          setSlides(createFallbackSlides());
          setIsLoading(false);
        }
      }
    };

    const createFallbackSlides = (): ArtworkSlide[] => [
      {
        id: "1",
        image: "/arts/art1.jpeg",
        artist: "Contemporary Masters",
        title: "Discover Extraordinary Art",
        price: 299,
        featured: true,
        discount: 20,
        views: 1250
      },
      {
        id: "2",
        image: "/arts/art2.jpeg",
        artist: "Modern Collection",
        title: "Limited Edition Pieces",
        price: 499,
        featured: true,
        discount: 0,
        views: 890
      },
      {
        id: "3",
        image: "/arts/art3.jpeg",
        artist: "Award Winners",
        title: "Featured Artists Gallery",
        price: 799,
        featured: false,
        discount: 15,
        views: 2100
      }
    ];

    if (useRealArtworks) {
      fetchArtworks();
    } else {
      setSlides(createFallbackSlides());
      setIsLoading(false);
    }

    return () => { mounted = false; };
  }, [useRealArtworks, limit]);

  // Auto-play slideshow with random intervals
  useEffect(() => {
    if (slides.length === 0 || isPaused || !autoPlay) return;

    const nextSlide = () => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
      setImageLoaded(false);
    };

    // Random interval between 3-6 seconds for variety
    const randomDelay = interval + (Math.random() * 2000 - 1000);
    
    slideIntervalRef.current = window.setTimeout(nextSlide, randomDelay);
    
    return () => {
      if (slideIntervalRef.current) {
        window.clearTimeout(slideIntervalRef.current);
      }
    };
  }, [currentIndex, slides, isPaused, autoPlay, interval]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const goToSlide = (index: number) => {
    if (slideIntervalRef.current) {
      window.clearTimeout(slideIntervalRef.current);
    }
    setCurrentIndex(index);
    setImageLoaded(false);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  };

  const getDiscountedPrice = (slide: ArtworkSlide) => {
    if (slide.discount && slide.discount > 0) {
      const price = Number(slide.price) || 0;
      return price - (price * slide.discount / 100);
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className={`relative overflow-hidden ${aspect} flex items-center justify-center bg-gray-100 dark:bg-gray-900`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Loading amazing artworks...</p>
        </div>
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <section className={`relative overflow-hidden ${aspect} flex items-center justify-center bg-gray-100 dark:bg-gray-900`}>
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">No artworks available</p>
          <Link href="/gallery" className="mt-4 inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            Browse Gallery
          </Link>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];


  return (
    <section
      className={`relative overflow-hidden text-white w-full ${aspect}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slideshow with Multiple Images */}
      <div className="absolute inset-0 z-0 w-full">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              i === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <Image 
              src={slide.image} 
              alt={slide.title} 
              fill
              className={`object-cover brightness-75 transition-all duration-1000 ${
                imageLoaded && i === currentIndex 
                  ? 'scale-100 blur-0' 
                  : 'scale-110 blur-sm'
              }`}
              onLoad={i === currentIndex ? handleImageLoad : undefined}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center py-12 md:py-20">
        <div className="container mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Artwork Info - Left Side */}
            <div className={`space-y-4 md:space-y-6 transition-all duration-700 ${
              imageLoaded 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 md:gap-3 animate-fade-in-up">
                {currentSlide.featured && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full animate-pulse">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Featured
                  </span>
                )}
                {currentSlide.discount && currentSlide.discount > 0 && (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs md:text-sm font-bold rounded-full animate-bounce">
                    {currentSlide.discount}% OFF
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-500 text-white text-xs md:text-sm font-bold rounded-full animate-pulse">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Limited Time
                </span>
                <span className="px-3 py-1 bg-purple-500 text-white text-xs md:text-sm font-bold rounded-full">
                  <Palette className="w-3 h-3 inline mr-1" />
                  {slides.length} Artworks
                </span>
              </div>

              {/* Artist Name */}
              <p className="text-emerald-300 dark:text-emerald-200 font-medium tracking-wide uppercase text-sm md:text-base animate-fade-in-up">
                {currentSlide.artist}
              </p>

              {/* Artwork Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up">
                {currentSlide.title}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-4 animate-fade-in-up delay-100">
                {getDiscountedPrice(currentSlide) ? (
                  <>
                    <span className="text-3xl md:text-4xl font-bold text-yellow-400 animate-pulse">
                      ${getDiscountedPrice(currentSlide)?.toFixed(2)}
                    </span>
                    <span className="text-xl md:text-2xl text-gray-300 line-through">
                      ${Number(currentSlide.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl md:text-4xl font-bold text-yellow-400">
                    ${Number(currentSlide.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Views & Slide Counter */}
              <div className="flex items-center gap-4 text-base md:text-lg animate-fade-in-up delay-200">
                <span className="inline-flex items-center gap-2 text-gray-200">
                  <Eye className="w-4 h-4" />
                  {currentSlide.views?.toLocaleString()} views
                </span>
                <span className="text-gray-300 text-sm">
                  ({currentIndex + 1} of {slides.length})
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4 pt-4 animate-fade-in-up delay-300">
                <Link 
                  href="/gallery"
                  className="px-6 md:px-8 py-3 md:py-4 bg-yellow-400 text-gray-900 font-bold text-base md:text-lg rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-pulse hover:animate-none inline-flex items-center gap-2"
                >
                  Shop Now →
                </Link>
                <Link 
                  href="/gallery"
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-white font-bold text-base md:text-lg rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Browse All {slides.length}
                </Link>
              </div>

              {/* Special Offer Text */}
              <div className="pt-4 animate-fade-in-up delay-400">
                <p className="text-yellow-300 font-semibold animate-pulse text-sm md:text-base">
                  🚚 Free Shipping • ⚡ Discover {slides.length} Amazing Artworks
                </p>
              </div>
            </div>

            {/* Image Preview - Right Side */}
            <div className="hidden lg:block relative">
              <div className={`relative group transition-all duration-1000 ${
                imageLoaded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
              }`}>
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-purple-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 animate-pulse" />
                <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src={currentSlide.image} 
                    alt={currentSlide.title}
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                    onLoad={handleImageLoad}
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-1000" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
        
        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex 
                  ? 'w-8 md:w-12 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-32 -right-32 w-64 md:w-80 h-64 md:h-80 rounded-full bg-yellow-400 opacity-10 blur-3xl animate-pulse" />
      <div className="absolute -top-32 -left-32 w-64 md:w-80 h-64 md:h-80 rounded-full bg-purple-600 opacity-10 blur-3xl animate-pulse delay-1000" />
    </section>
  );
}
