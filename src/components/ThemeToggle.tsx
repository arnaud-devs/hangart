"use client";

import React, { useEffect, useState } from "react";

const THEME_KEY = "theme";

type Props = {
  labels?: {
    dark?: string;
    light?: string;
  };
};

export default function ThemeToggle({ labels }: Props) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
      } else {
        const prefersDark =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // ignore
    }
  }

  const darkLabel = labels?.dark ?? "Dark";
  const lightLabel = labels?.light ?? "Light";

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="theme-toggle-btn"
    >
      {theme === "dark" ? lightLabel : darkLabel}
    </button>
  );
}
