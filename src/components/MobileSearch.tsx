"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function MobileSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const popular = ["still life", "mixed media", "geometric", "horse", "landscape"];

  return (
    <div className="md:hidden">
      <button
        aria-label="Open search"
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full bg-white/0 flex items-center justify-center text-white"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
          <div className="fixed inset-x-4 top-5 z-50 flex justify-center">
            <div ref={ref} className="w-full max-w-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg shadow-lg max-h-[80vh] overflow-auto">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  ref={inputRef}
                  placeholder="Search"
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <button aria-label="Close search" onClick={() => setOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Searches</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button key={p} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                    {p}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
                  </svg>
                </div>
                <a className="underline">TRY VISUAL SEARCH</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
