"use client";

import React from "react";
import Link from "next/link";

export default function CollectionsPage() {
  const collections = [
    { slug: "new-arrivals", title: "New Arrivals", description: "Fresh works from emerging artists" },
    { slug: "editor-picks", title: "Editor Picks", description: "Curated highlights from our team" },
    { slug: "under-1000", title: "Under $1,000", description: "Great art at accessible prices" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Collections</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Browse curated collections to jumpstart your discovery.</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(c => (
            <li key={c.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-1">{c.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{c.description}</p>
              <Link href={`/gallery?collection=${c.slug}`} className="text-indigo-600 hover:underline">Explore</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
