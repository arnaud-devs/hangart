"use client";

// components/Navbar.tsx
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from '@/lib/authProvider';
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileSearch from "./MobileSearch";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const { user } = useAuth();
  const isBuyer = (user?.role || '').toString().toLowerCase() === 'buyer';

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/artist", label: "Artists" },
    { href: "/contact", label: "Contact" },
  ];

  const buyerLinks = [
    { href: '/cart', label: 'Cart' },
    { href: '/orders', label: 'Orders' },
    { href: '/payments', label: 'Payments' },
    { href: '/refunds', label: 'Refunds' },
  ];

  const helpLinks = [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <>
      {/* Grab auth user to conditionally show buyer-only links */}
      {/* Note: useAuth is client-only, Navbar is client component */}
      {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
      {null}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left - Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl md:text-3xl font-serif text-[#3C3C43] dark:text-[#DFDFD6] leading-none">
                Hangart
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Buyer-only links (visible only when a buyer is logged in) */}
                {isBuyer && buyerLinks.map(link => (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                ))}
                {/* Help Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setHelpMenuOpen(!helpMenuOpen)}
                    onBlur={() => setTimeout(() => setHelpMenuOpen(false), 200)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Help
                    <ChevronDown className={`w-4 h-4 transition-transform ${helpMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {helpMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {helpLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setHelpMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center - Search (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center px-4 max-w-2xl">
              <div className="w-full">
                <input
                  type="search"
                  placeholder="Search for arts product"
                  className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Right - actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile search */}
              <div className="md:hidden">
                <MobileSearch />
              </div>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <UserMenu />

              {/* Cart Button - show only for authenticated buyers */}
              {isBuyer && (
                <div className="hidden sm:block">
                  <CartButton />
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-black shadow-2xl border-r border-gray-200 dark:border-white/10 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#3C3C43] dark:text-[#DFDFD6]"
            >
              Hangart
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {/* Main Navigation Links */}
              <div className="mb-4">
                <div className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Navigation
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {isBuyer && (
                  <div className="mt-3">
                    <div className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer</div>
                    {buyerLinks.map(link => (
                      <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Help Section */}
              <div className="mb-4">
                <div className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Help & Info
                </div>
                {helpLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Cart (Mobile Only) - visible only to buyers */}
              {isBuyer && (
                <div className="sm:hidden mb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <CartButton />
                    <span>Shopping Cart</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10">
            <div className="sm:hidden mb-3">
              <LanguageSwitcher />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2025 Hangart. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}