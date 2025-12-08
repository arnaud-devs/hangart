// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from '@/lib/authProvider';
import { ToastProvider } from '@/components/ui/Toast';
import CartDrawer from "@/components/CartDrawer";
import Breadcrumbs from '@/components/Breadcrumbs';
import HideWhenDashboard from '@/components/HideWhenDashboard';
import React from "react";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HangartGallery – Discover Original Art Online",
  description:
    "Explore original paintings, photography, sculpture and more from emerging global artists.",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function RootLayout({ children }: RootLayoutProps) {
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
      suppressHydrationWarning
      {...(cookieTheme
        ? {
            'data-theme': cookieTheme,
            className: cookieTheme === 'dark' ? 'dark' : undefined,
          }
        : undefined)}
    >
      <head>
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
        className={`${inter.variable} min-h-screen text-gray-900 dark:text-gray-100 overflow-x-hidden antialiased font-sans`}
      >
        {/* Wrap with AuthProvider first, then CartProvider, then ToastProvider */}
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <HideWhenDashboard>
                  <header>
                    <Navbar />
                  </header>

                  <div className="w-full">
                    <Breadcrumbs />
                  </div>
                </HideWhenDashboard>

                <main className="flex-1 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </main>

                <HideWhenDashboard>
                  <Footer />
                </HideWhenDashboard>
              </div>

              <CartDrawer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}