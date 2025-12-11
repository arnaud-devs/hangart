"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

// Shadcn-like breadcrumb component (lightweight, no external shadcn dependency)
export default function Breadcrumbs() {
  const pathname = usePathname() || '/';

  // Split into segments and build incremental hrefs
  const parts = pathname.split('/').filter(Boolean);

  // If there are no path segments (we're at the site root), don't render breadcrumbs
  if (parts.length === 0) return null;

  const crumbs = [{ label: 'Home', href: '/' }, ...parts.map((p, idx) => {
    const href = '/' + parts.slice(0, idx + 1).join('/');
    // decode param-like segments for display
    const label = decodeURIComponent(p).replaceAll('-', ' ');
    return { label, href };
  })];

  return (
    <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center">
            {i === 0 ? (
              <Link href={c.href} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-200 hover:underline">
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                <Link href={c.href} className={`hover:underline ${i === crumbs.length - 1 ? 'text-gray-900 dark:text-[#DFDFD6] font-medium' : ''}`}>
                  {c.label}
                </Link>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
