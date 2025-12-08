"use client";

// components/Navbar.tsx
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileSearch from "./MobileSearch";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/artist", label: "Artists" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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

            {/* Cart Button */}
            <div className="hidden sm:block">
              <CartButton />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 pt-3 mt-2">
                <div className="px-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}