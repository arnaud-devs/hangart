"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "../components/Carousel";
import RotatingArtwork from "../components/RotatingArtwork";
import ArtworkGalleryCard from "../components/ArtworkGalleryCard";
import TestimonialCard from "../components/TestimonialCard";
import HomeArtworksGallery from "../components/HomeArtworksGallery";
import HolidayCollection from "../components/HolidayCollection";
import { Globe, Truck, Star, ShieldCheck, Award, Smile } from "lucide-react";
import { useI18n } from "@/lib/i18nClient";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="bg-[#f7f7f8] dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <section
        className="relative w-full bg-cover bg-center"
       >
        {/* Dark mode grid overlay like Vercel */}
        <div
          className="absolute inset-0 -z-10 hidden dark:block"
          style={{
            backgroundColor: '#000000',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px',
            backgroundPosition: '0 0, 0 0',
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12 pb-20 md:pb-28 min-h-[82vh] pt-24 md:pt-28">
            {/* Left Column: Text Content */}
            <div className="w-full md:w-1/2 text-gray-900 dark:text-gray-100 flex flex-col justify-center items-center md:items-start text-center md:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-800 dark:text-white">
                <span className="text-yellow-600 dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-yellow-300 dark:to-yellow-500 dark:drop-shadow-[0_0_18px_rgba(234,179,8,0.35)]">{t("hero_connect")}</span> {t("hero_with_artist")}
              </h1>
              <p className="mt-6 max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-300">
                {t("hero_tagline")}
              </p>
              <div className="mt-10">
                <Link
                  href="/gallery"
                  className="inline-block rounded-full bg-yellow-600 text-white px-8 py-4 font-semibold text-lg shadow-lg hover:bg-yellow-700 transition-transform transform hover:scale-105"
                >
                  {t("shop_with_us")}
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Rotating Artwork */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative w-full h-[60vh] md:h-[75vh] rounded-3xl overflow-hidden shadow-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-transparent">
                <RotatingArtwork src="/arts/art3.jpeg" alt="Rotating Artwork" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Explorer */}
      <HomeArtworksGallery />

      {/* Holiday 2025 Collection */}
      <HolidayCollection />

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 dark:bg-black py-20 relative">
        {/* Dark mode grid overlay for section */}
        <div
          className="absolute inset-0 -z-10 hidden dark:block"
          style={{
            backgroundColor: '#000000',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px',
            backgroundPosition: '0 0, 0 0',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{t("why_choose")}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              An unparalleled experience in the world of art.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white dark:bg-white/5 dark:backdrop-blur-lg dark:border dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t("global_selection")}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t("global_selection_desc")}</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-white/5 dark:backdrop-blur-lg dark:border dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t("free_returns")}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t("free_returns_desc")}</p>
            </div>
            <div className="text-center p-8 bg-white dark:bg-white/5 dark:backdrop-blur-lg dark:border dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t("top_rated")}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t("top_rated_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{t('testimonials_title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{t('testimonials_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sarah Johnson"
            role={t('testimonials.items.sarah_johnson.role')}
            location={t('testimonials.items.sarah_johnson.location')}
            rating={5}
            comment={t('testimonials.items.sarah_johnson.comment')}
          />
          <TestimonialCard
            name="Michael Chen"
            role={t('testimonials.items.michael_chen.role')}
            location={t('testimonials.items.michael_chen.location')}
            rating={5}
            comment={t('testimonials.items.michael_chen.comment')}
          />
          <TestimonialCard
            name="Emma Rodriguez"
            role={t('testimonials.items.emma_rodriguez.role')}
            location={t('testimonials.items.emma_rodriguez.location')}
            rating={5}
            comment={t('testimonials.items.emma_rodriguez.comment')}
          />
          <TestimonialCard
            name="David Kim"
            location={t('testimonials.items.david_kim.location')}
            rating={5}
            comment={t('testimonials.items.david_kim.comment')}
          />
          <TestimonialCard
            name="Sophie Martin"
            role={t('testimonials.items.sophie_martin.role')}
            location={t('testimonials.items.sophie_martin.location')}
            rating={5}
            comment={t('testimonials.items.sophie_martin.comment')}
          />
          <TestimonialCard
            name="James Wilson"
            role={t('testimonials.items.james_wilson.role')}
            location={t('testimonials.items.james_wilson.location')}
            rating={5}
            comment={t('testimonials.items.james_wilson.comment')}
          />
        </div>
      </section>
    </div>
  );
}
