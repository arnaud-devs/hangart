"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "theme";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    setMounted(true);
    
    try {
      // If the server already rendered a data-theme attribute on <html>, prefer that
      // to avoid changing attributes during hydration which causes mismatch warnings.
      const serverAttr = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
      if (serverAttr === 'dark' || serverAttr === 'light') {
        setTheme(serverAttr);
        if (serverAttr === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return;
      }

      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
        // keep Tailwind dark: utility working by toggling the `dark` class on <html>
        if (saved === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        return;
      }

      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
      // ensure Tailwind `dark:` utilities respond to the initial preference
      if (initial === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {
      // ignore
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      document.documentElement.setAttribute("data-theme", next);
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      // persist in a cookie so server-side rendering can read the preference
      try {
        document.cookie = `theme=${next}; Path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (e) {
        // ignore cookie set errors
      }
      // prefer direct property assignment (matches Tailwind's docs snippet)
      // this will allow the inline head script to read `localStorage.theme` early
      // and avoid FOUC on subsequent loads
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localStorage.theme = next;
    } catch (e) {
      // ignore
    }
  }

  const isDark = theme === "dark";

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        suppressHydrationWarning
        aria-label="Toggle theme"
        className="relative inline-flex items-center w-16 h-9 rounded-full p-1 bg-neutral-800"
      >
        <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 shadow translate-x-7">
          <Moon className="w-4 h-4 text-gray-900" />
        </span>
      </button>
    );
  }

  return (
    <button
      suppressHydrationWarning
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`relative inline-flex items-center w-16 h-9 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark ? "bg-neutral-800" : "bg-gray-200"
      }`}
    >
      {/* track (background) */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full transition-colors ${isDark ? "bg-neutral-800" : "bg-gray-200"}`}
      />

      {/* knob */}
      <span
        className={`relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 shadow transform transition-transform ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon className="w-4 h-4 text-gray-900" /> : <Sun className="w-4 h-4 text-yellow-500" />}
      </span>
    </button>
  );
}
