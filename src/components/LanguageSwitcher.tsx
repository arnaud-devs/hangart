"use client";

import React, { useEffect, useState } from "react";

const LOCALES = ["rw", "en", "fr", "es", "zh", "sw"];
const DEFAULT_LOCALE = "rw"; // use Kinyarwanda as the default language
const LOCALE_LABELS: Record<string, string> = {
  rw: "RW",
  en: "EN",
  fr: "FR",
  es: "ES",
  zh: "中文",
  sw: "SW",
};

function setLangCookie(lang: string) {
  // persist for 1 year
  document.cookie = `lang=${lang}; Path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<string>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const m = document.cookie.match(/(?:^|; )lang=([^;]+)/);
      if (m) setCurrent(m[1]);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          className={`lang-switch-btn ${current === l ? "opacity-80" : "opacity-100"}`}
          onClick={() => {
            setLangCookie(l);
            // reload current path, do not change the URL path
            window.location.reload();
          }}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
