"use client";

import React from "react";
import { Users, Palette, Globe, Sparkles, Target, Heart, Shield } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Artist Support",
      description: "We champion artists by providing fair commissions and tools to grow their creative careers.",
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Authentic Art",
      description: "Every piece is original and verified, ensuring you get genuine artwork directly from creators.",
      color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community First",
      description: "We foster a supportive, inclusive community where artists and collectors connect and thrive.",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Bringing together artists and collectors from around the world in one accessible platform.",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simple Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                About HangArt
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Empowering artists, inspiring collectors
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A global marketplace connecting talented artists with passionate collectors. We believe in the power of original art to transform spaces and lives.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${value.color.split(' ')[0]} ${value.color.split(' ')[2]}`}>
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8 mb-12 border border-yellow-100 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            To make art accessible, support creative careers, and foster a vibrant, supportive art community. 
            Whether you're a seasoned collector or just starting your journey, HangArt is your home for inspiration and connection.
          </p>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Join us and discover the art that moves you</span>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Founded by artists and art lovers, HangArt began with a simple idea: make it easier for artists to share their work with the world and for collectors to discover unique pieces.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Today, we're proud to support thousands of artists worldwide, helping them turn their passion into sustainable careers while bringing beautiful, original art into homes and spaces everywhere.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Artist Payout</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Artists</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">24h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to explore?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              <Palette className="w-4 h-4" />
              Browse Artwork
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
            >
              <Users className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}