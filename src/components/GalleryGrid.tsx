"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Artwork = {
  id: string | number;
  title: string;
  imageUrl?: string;
  artistName?: string;
  price?: number | string;
  currency?: string;
  category?: string;
};

type Props = {
  artworks: Artwork[];
};

// Simple styled select that mimics shadcn-ui visuals using native <select>
function StyledSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <select
        aria-label={ariaLabel}
        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function GalleryGrid({ artworks }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  const categories = useMemo(() => {
    const set = new Set<string>();
    artworks.forEach((a) => a.category && set.add(a.category));
    return ["all", ...Array.from(set)];
  }, [artworks]);

  const filtered = useMemo(() => {
    let list = artworks.slice();

    if (category !== "all") {
      list = list.filter((a) => a.category === category);
    }

    if (priceFilter !== "all") {
      list = list.filter((a) => {
        const price = typeof a.price === "string" ? parseFloat(a.price) : (a.price as number);
        if (Number.isNaN(price)) return false;
        switch (priceFilter) {
          case "under-500":
            return price < 500;
          case "500-1000":
            return price >= 500 && price <= 1000;
          case "1000-2000":
            return price > 1000 && price <= 2000;
          case "2000-plus":
            return price > 2000;
          default:
            return true;
        }
      });
    }

    // sorting
    if (sort === "price-asc") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "price-desc") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } // newest keeps original order

    return list;
  }, [artworks, category, priceFilter, sort]);

  function handleCardClick(id: string | number) {
    router.push(`/artwork/${id}`);
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Category</span>
            <StyledSelect
              ariaLabel="Filter by category"
              value={category}
              onChange={setCategory}
              options={[{ value: "all", label: "All" }, ...categories.filter((c) => c !== "all").map((c) => ({ value: c, label: c }))]}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Price</span>
            <StyledSelect
              ariaLabel="Filter by price"
              value={priceFilter}
              onChange={setPriceFilter}
              options={[
                { value: "all", label: "All" },
                { value: "under-500", label: "Under $500" },
                { value: "500-1000", label: "$500 - $1,000" },
                { value: "1000-2000", label: "$1,000 - $2,000" },
                { value: "2000-plus", label: "$2,000+" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Sort</span>
          <StyledSelect
            ariaLabel="Sort artworks"
            value={sort}
            onChange={setSort}
            options={[
              { value: "newest", label: "Newest" },
              { value: "price-asc", label: "Price: Low → High" },
              { value: "price-desc", label: "Price: High → Low" },
            ]}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((art) => (
          <div
            key={art.id}
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(art.id)}
            onKeyDown={(e) => (e.key === "Enter" ? handleCardClick(art.id) : undefined)}
            className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-700">
                <Image
                  src={art.imageUrl || "/hero-bg.png"}
                  alt={art.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{art.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">{art.artistName || "Unknown"}</p>
                {art.price !== undefined ? (
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {art.currency || "$"}
                    {art.price}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
