"use server";

import Image from "next/image";
import Link from "next/link";
import ArtworkCard from "../components/ArtworkCard";
import GalleryGrid from "../components/GalleryGrid";
import Carousel from "../components/Carousel";
import ArtworkGalleryCard from "../components/ArtworkGalleryCard";
import TestimonialCard from "../components/TestimonialCard";
import { Globe, Truck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import sampleArtworks from "@/data/SampleArtworks";

type Artwork = {
  id: string | number;
  title: string;
  artist?: string;
  image?: string;
  price?: string;
};

async function fetchFeaturedArtworks(limit = 8): Promise<Artwork[]> {
  try {
    const res = await fetch(`/api/artworks?featured=true&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, limit) : [];
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const artworks = await fetchFeaturedArtworks(8);

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
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#3C3C43] dark:text-gray-100">CONNECT WITH<br/>AN ARTIST</h2>
              <p className="mt-4 max-w-md text-gray-700 dark:text-gray-300">every artwork is made by hand and tells story</p>

              <div className="mt-8">
                <Link href="/gallery" className="inline-block rounded-full bg-yellow-400 text-[#DFDFD6] px-6 py-3 font-semibold dark:bg-yellow-400 ">
                  SHOP WITH US
                </Link>
              </div>
            </div>

            {/* Right carousel (interactive) */}
            <div className="w-full md:w-1/2 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-2xl bg-[#F6F6F7] dark:bg-gray-800">
              <div className="relative w-full max-w-xl h-[40vh] md:h-[70vh] rounded-2xl overflow-hidden">
                <Carousel images={["/arts/art1.jpeg", "/arts/art2.jpeg", "/arts/art3.jpeg", "/arts/art4.jpeg"]} aspect="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery explorer - client component */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold font-serif text-gray-900 dark:text-gray-100">Browse the gallery</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Filter and explore more artworks.</p>

        <div className="mt-6">
          {/* Map server-side artworks to the client component's expected shape */}
          <GalleryGrid
            artworks={sampleArtworks.map((a) => ({
              id: a.id,
              title: a.title,
              imageUrl: (a as any).image || (a as any).imageUrl || "/placeholder-art.png",
              artistName: (a as any).artist || (a as any).artistName,
              price: (a as any).price,
              currency: (a as any).currency,
              category: (a as any).category,
            }))}
          />
        </div>
      </section>

      {/* Featured artworks grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 font-serif dark:text-gray-100">Featured Artworks</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Hand-picked works from our curated collection.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleArtworks.length > 0 ? (
            sampleArtworks.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={{
                  ...art,
                  price: typeof (art as any).price === "number" ? String((art as any).price) : (art as any).price,
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No featured artworks found.</div>
          )}
        </div>
      </section>

      {/* Holiday 2025 Collection */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-gray-100">Holiday 2025</h2>
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous artworks"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              suppressHydrationWarning
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Next artworks"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ArtworkGalleryCard
            id="1"
            title="Briancon White Painting"
            artist="Christopher Elliot"
            location="France"
            medium="Acrylic On Canvas"
            dimensions="27.6 × 21.3 in"
            price="$2,765"
            image="/arts/art5.jpeg"
          />
          <ArtworkGalleryCard
            id="2"
            title='"Radiate - Higher Density" Painting'
            artist="Dorota Jedrusik"
            location="Poland"
            medium="Oil On Canvas"
            dimensions="51 × 35 in"
            price="$5,045"
            image="/arts/art6.jpeg"
          />
          <ArtworkGalleryCard
            id="3"
            title="Metamorphosis Painting"
            artist="Young Park"
            location="South Korea"
            medium="Acrylic On Canvas"
            dimensions="57.3 × 44.1 in"
            price="$3,875"
            image="/arts/art7.jpeg"
          />
          <ArtworkGalleryCard
            id="4"
            title="Life Of The Pond Painting"
            artist="Trine Churchill"
            location="United States"
            medium="Acrylic On Canvas"
            dimensions="30 × 24 in"
            price="$2,895"
            image="/arts/art8.jpeg"
          />
        </div>
      </section>

      {/* Why choose section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-[#F6F6F7] border-gray-100 dark:border-gray-800 dark:bg-gray-800 border-t rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 font-serif">Why Choose Hangart Gallery</h3>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                <Globe className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Global Selection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Discover original works from emerging artists around the world.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                <Truck className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Free Returns</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hassle-free returns so you can buy with confidence.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700">
                <Star className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Top-rated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Thousands of 5-star reviews from collectors worldwide.</p>
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
