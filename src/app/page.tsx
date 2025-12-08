"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "../components/Carousel";
import ArtworkGalleryCard from "../components/ArtworkGalleryCard";
import TestimonialCard from "../components/TestimonialCard";
import HomeArtworksGallery from "../components/HomeArtworksGallery";
import HolidayCollection from "../components/HolidayCollection";
import { Globe, Truck, Star, ChevronLeft, ChevronRight } from "lucide-react";

// Fallback translations for client-side rendering
const defaultTranslations = {
  hero_connect: "Connect",
  hero_with_artist: "with Artists",
  hero_tagline: "Discover unique artworks from talented artists around the world",
  shop_with_us: "Shop with us",
  holiday_2025: "Holiday 2025 Collection",
  prev_artworks: "Previous",
  next_artworks: "Next",
  why_choose: "Why Choose Us",
  global_selection: "Global Selection",
  global_selection_desc: "Artworks from talented artists worldwide",
  free_returns: "Free Returns",
  free_returns_desc: "Hassle-free returns within 30 days",
  top_rated: "Top Rated",
  top_rated_desc: "Trusted by thousands of collectors",
};

export default function Home() {
  const t = defaultTranslations;

  return (
    // Let the root CSS variable (--background) control the page background.
    <div>
      {/* Hero banner (styled like attachment) */}
      <section
        className="relative w-full bg-center bg-no-repeat"
        style={{ backgroundImage: "" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top navigation */}

          {/* Main hero content */}
          <div className="relative flex flex-col-reverse justify-center md:flex-row items-center gap-8 pb-24 md:pb-32 min-h-screen">
            {/* Left column */}
            <div className="w-full md:w-1/2 text-gray-900 dark:text-gray-100 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold leading-tight text-[#3C3C43] dark:text-gray-100">
                <p className="text-yellow-600">{t.hero_connect} </p>
                {t.hero_with_artist}
              </h2>
              <p className="mt-4 max-w-md text-gray-700 dark:text-gray-300 font-inter text-[18px] md:text-[24px]">{t.hero_tagline}</p>

              <div className="mt-8">
                <Link href="/gallery" className="inline-block rounded-full bg-yellow-600 text-white px-6 py-3 font-semibold dark:bg-yellow-600 ">
                  {t.shop_with_us}
                </Link>
              </div>
            </div>

            {/* Right carousel (interactive) */}
            <div className="w-full md:w-1/2 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-2xl bg-[#F6F6F7] dark:bg-gray-800">
              <div className="relative w-full max-w-xl h-[40vh] md:h-[70vh] rounded-2xl overflow-hidden">
                <Carousel useRealArtworks={true} limit={8} interval={2000} aspect="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery explorer - client component */}
      <HomeArtworksGallery />

      {/* Holiday 2025 Collection */}
      <HolidayCollection />

      {/* Why choose section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-[#F6F6F7] border-gray-100 dark:border-gray-800 dark:bg-gray-800 border-t rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 font-serif">{t.why_choose}</h3>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                <Globe className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t.global_selection}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.global_selection_desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                <Truck className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t.free_returns}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.free_returns_desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                <Star className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{t.top_rated}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.top_rated_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-gray-100 mb-2">
            What Our Collectors Say
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Trusted by thousands of art lovers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard
            name="Sarah Johnson"
            role="Interior Designer"
            location="New York, USA"
            rating={5}
            comment="The quality of the artwork exceeded my expectations. The piece I purchased has become the centerpiece of my living room. The shipping was fast and the packaging was excellent."
          />
          <TestimonialCard
            name="Michael Chen"
            role="Art Collector"
            location="London, UK"
            rating={5}
            comment="I've been collecting art for over 20 years, and Hangart Gallery has some of the most unique pieces I've seen. The customer service team was incredibly helpful in answering all my questions."
          />
          <TestimonialCard
            name="Emma Rodriguez"
            role="Curator"
            location="Barcelona, Spain"
            rating={5}
            comment="As a professional curator, I appreciate the authenticity and diversity of the collection. Every piece tells a story, and the platform makes discovering new artists so easy."
          />
          <TestimonialCard
            name="David Kim"
            location="Seoul, South Korea"
            rating={5}
            comment="The investment in art from this gallery has been wonderful. Not only do I love the pieces, but the value has appreciated over time. Highly recommend!"
          />
          <TestimonialCard
            name="Sophie Martin"
            role="Photography Enthusiast"
            location="Paris, France"
            rating={5}
            comment="Beautiful photography collection! I found the perfect piece for my home office. The checkout process was seamless and delivery was on time."
          />
          <TestimonialCard
            name="James Wilson"
            role="Tech Entrepreneur"
            location="San Francisco, USA"
            rating={5}
            comment="Love supporting emerging artists through this platform. The curation is top-notch and I've discovered several artists whose work I now follow closely."
          />
        </div>
      </section>
    </div>
  );
}
