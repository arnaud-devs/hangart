import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";
import { User, ShoppingCart } from 'lucide-react';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileSearch from "@/components/MobileSearch";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import CartButton from "@/components/CartButton";
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
            {/* Cart button (client) - shows count and opens drawer */}
            <div className="hidden sm:block">
              <CartButton />
            </div>
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

export default async function RootLayout({ children }: RootLayoutProps) {
  // `cookies()` returns an async CookiesStore in Next.js 16+ and must be awaited
  // before accessing `.get`. Awaiting here ensures we don't access a Promise
  // synchronously which causes runtime errors in development.
  let cookieTheme: string | undefined = undefined;
  try {
    const cookieStore = await cookies();
    const c = (cookieStore as any).get?.("theme");
    cookieTheme = c?.value;
  } catch (e) {
    cookieTheme = undefined;
  }


  return (
    <html
      // Suppress hydration warnings for attributes that may be set very early
      // by a small inline script reading cookies/localStorage. We also render
      // server-side attributes when available, but the inline script below
      // ensures the DOM is coerced to the same theme before React hydrates.
      suppressHydrationWarning
      {...(cookieTheme
        ? {
            'data-theme': cookieTheme,
            className: cookieTheme === 'dark' ? 'dark' : undefined,
          }
        : undefined)}
    >
      <head>
        {/* Inline script to set dark class early to avoid FOUC when no server cookie is present.
            If we have a server cookie we render the class on <html> so no inline script is necessary. */}
        {/* Inline script runs as early as possible and sets the html `data-theme`
            and `class` from a `theme` cookie (preferred) or `localStorage.theme`.
            This runs before hydration and avoids FOUC and most hydration
            mismatches when client/server theme sources differ. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{
              var getCookie=function(n){return document.cookie.split('; ').reduce(function(r,c){var p=c.split('=');if(p[0]===n)return decodeURIComponent(p[1]||'');return r;},undefined)};
              var c = getCookie('theme');
              var t = c || (typeof localStorage!=='undefined' && localStorage.getItem('theme')) || '';
              if(t){
                document.documentElement.classList.toggle('dark', t==='dark');
                document.documentElement.setAttribute('data-theme', t);
              }
            }catch(e){};`,
          }}
        />
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

        <CartProvider>
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

          {/* Global cart drawer / UI */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
