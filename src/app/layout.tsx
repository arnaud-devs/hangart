import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";
import { User, ShoppingCart } from 'lucide-react';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileSearch from "@/components/MobileSearch";
import React from "react";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HangartGallery – Discover Original Art Online",
  description:
    "Explore original paintings, photography, sculpture and more from emerging global artists.",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

/*
  Placeholder Navbar and Footer are defined here to avoid missing imports.
  You can move them to `src/components` later if you want full implementations.
*/
const Navbar: React.FC = () => {
  return (
    <nav className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Left - Logo */}
          <div className="flex items-center gap-4">
            <a href="/" className="text-3xl font-serif text-black dark:text-white leading-none">Hangart</a>
          </div>

          {/* Center - Search (kept responsive) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-xl">
              <input
                type="search"
                placeholder="Search for arts product"
                className="w-full rounded-full border border-transparent bg-white/50 dark:bg-gray-700/30 px-4 py-3 text-sm shadow-md focus:outline-none text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Right - actions */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <MobileSearch />
            </div>

            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <ThemeToggle />

            <a href="#" className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-gray-800 dark:text-white"><User /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-gray-800 dark:text-white"><ShoppingCart /></a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-center">
      © {new Date().getFullYear()} HangartGallery. All rights reserved.
    </div>
  </footer>
);

export default function RootLayout({ children }: RootLayoutProps) {
  const cookieTheme = (() => {
    try {
      // cookies() typing may vary by Next.js version; use `any` to avoid build-time type mismatch
      const c = (cookies() as any).get?.("theme");
      return c?.value;
    } catch (e) {
      return undefined;
    }
  })();


  return (
    <html>
      <head>
        {/* Inline script to set dark class early to avoid FOUC when no server cookie is present.
            If we have a server cookie we render the class on <html> so no inline script is necessary. */}
        {!cookieTheme && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "try{const t = localStorage.theme; if(t){document.documentElement.classList.toggle('dark', t==='dark'); document.documentElement.setAttribute('data-theme', t);} }catch(e){};",
            }}
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        // background is controlled by CSS custom properties in `globals.css` (--background)
        className={`min-h-screen text-gray-900 dark:text-gray-100 antialiased `}
      >
        {/*
          Providers placeholder
          - i18n provider should wrap the app here
          - ThemeProvider (dark/light) should wrap the app here (e.g. next-themes)
        */}

        <div className="flex flex-col min-h-screen">
          {/* Top navigation */}
          <header>
            <Navbar />
          </header>

          {/* Main content area - mobile-first responsive container */}
          <main className="flex-1 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* TODO: wrap `children` with Providers (i18n, ThemeProvider) in the future */}
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
