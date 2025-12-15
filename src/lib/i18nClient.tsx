"use client";

import React, { createContext, useContext, useMemo } from "react";

type Messages = Record<string, any>;

type I18nContextType = {
  lang: string;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

function resolvePath(obj: any, path: string): any {
  return path.split(".").reduce((acc: any, part: string) => (acc ? acc[part] : undefined), obj);
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return Object.keys(vars).reduce((s, k) => s.replace(new RegExp(`{${k}}`, "g"), String(vars[k])), str);
}

export function I18nProvider({ lang, messages, children }: { lang: string; messages: Messages; children: React.ReactNode }) {
  const value = useMemo<I18nContextType>(() => ({
    lang,
    messages,
    t: (key: string, vars?: Record<string, string | number>) => {
      // Support both flat keys ("nav.home") and nested objects (messages.nav.home)
      let found: any = undefined;
      if (key in messages) {
        found = (messages as any)[key];
      } else {
        found = resolvePath(messages, key);
      }
      if (typeof found === "string") return interpolate(found, vars);
      return key; // fallback to key when missing
    },
  }), [lang, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      lang: "en",
      messages: {},
      t: (key: string) => key,
    } as I18nContextType;
  }
  return ctx;
}
