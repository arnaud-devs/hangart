"use server";

import Image from "next/image";
import Link from "next/link";
import ArtworkCard from "../components/ArtworkCard";
import GalleryGrid from "../components/GalleryGrid";
import Carousel from "../components/Carousel";
import { Globe, Truck, Star } from "lucide-react";

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
          <div className="relative flex flex-col-reverse md:flex-row items-center gap-8 pb-24 md:pb-32 min-h-screen">
            {/* Left column */}
            <div className="w-full md:w-1/2 text-gray-900 dark:text-gray-100 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-gray-900 dark:text-gray-100">CONNECT WITH<br/>AN ARTIST</h2>
              <p className="mt-4 max-w-md text-gray-700 dark:text-gray-300">every artwork is made by hand and tells story</p>

              <div className="mt-8">
                <Link href="/gallery" className="inline-block rounded-full bg-yellow-400 text-black px-6 py-3 font-semibold dark:bg-yellow-400 dark:text-black">
                  SHOP WITH US
                </Link>
              </div>
            </div>

            {/* Right carousel (interactive) */}
            <div className="w-full md:w-1/2 hidden md:flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
              <div className="relative w-full max-w-xl h-[420px] md:h-[70vh] rounded-2xl overflow-hidden">
                <Carousel images={["/pexels-tiana-18128-2956395.jpg", "/art2.svg", "/art3.svg", "/art4.svg"]} aspect="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery explorer - client component */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Browse the gallery</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Filter and explore more artworks.</p>

        <div className="mt-6">
          {/* Map server-side artworks to the client component's expected shape */}
          <GalleryGrid
            artworks={artworks.map((a) => ({
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Featured Artworks</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Hand-picked works from our curated collection.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.length > 0 ? (
            artworks.map((art) => <ArtworkCard key={art.id} artwork={art} />)
          ) : (
            <div className="col-span-full text-center text-gray-500">No featured artworks found.</div>
          )}
        </div>
      </section>

      {/* Why choose section */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Why Choose HuzaGallery</h3>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
                <Globe className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Global Selection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Discover original works from emerging artists around the world.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
                <Truck className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Free Returns</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hassle-free returns so you can buy with confidence.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
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
    </div>
  );
}
