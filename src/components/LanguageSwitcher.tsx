"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const LOCALES = ["rw", "en", "fr", "sw", "es", "zh"];
const DEFAULT_LOCALE = "rw"; // default language
const LOCALE_LABELS: Record<string, string> = {
  rw: "RW",
  en: "EN",
  fr: "FR",
  es: "ES",
  zh: "中文",
  sw: "SW",
};

function setLangCookie(lang: string) {
  document.cookie = `lang=${lang}; Path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function getLangCookie(): string {
  try {
    const m = document.cookie.match(/(?:^|; )lang=([^;]+)/);
    return m ? m[1] : DEFAULT_LOCALE;
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<string>(DEFAULT_LOCALE);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setCurrent(getLangCookie());

    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function choose(lang: string) {
    setLangCookie(lang);
    setCurrent(lang);
    setOpen(false);
    
    // Refresh the current page to apply new language
    router.refresh();
  }

  if (!mounted) {
    return (
      <div className="relative">
        <button
          suppressHydrationWarning
          className="flex items-center justify-center px-3 h-10 rounded-full bg-white/90 dark:bg-black/60"
          disabled
        >
          <span className="text-sm font-medium">{LOCALE_LABELS[DEFAULT_LOCALE]}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        suppressHydrationWarning
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center justify-center px-3 h-10 rounded-full bg-white/90 dark:bg-black/60"
        title="Select language"
      >
        <span className="text-sm font-medium">{LOCALE_LABELS[current] || current.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 z-40">
          <ul className="py-1">
            {LOCALES.map((l) => (
              <li key={l}>
                <button
                  suppressHydrationWarning
                  onClick={() => choose(l)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${current === l ? "font-semibold" : ""}`}
                >
                  {LOCALE_LABELS[l]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
