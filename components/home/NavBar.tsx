import React, { useState } from 'react'
import type { JSX } from 'react/jsx-runtime'

type Props = {
  cartCount?: number
}

const SearchIcon = ({ className = 'text-gray-400 w-4 h-4' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const UserIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const BagIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
  >
    <path d="M6 2l1.5 4h9L18 2z" />
    <path d="M3 6h18v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
    <path d="M16 10a4 4 0 0 0-8 0" />
  </svg>
)

export default function NavBar({ cartCount = 2 }: Props): JSX.Element {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header className="w-full py-4 px-4 md:px-6" role="banner">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Left - logo */}
        <div className="shrink-0">
          <a href="#" className="text-white font-serif no-underline text-[40px]" aria-label="Hangart home">
            Hangart
          </a>
        </div>

        {/* Center - desktop search */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-lg bg-white/95 rounded-xl px-4 py-2 flex items-center shadow-sm">
            <span className="mr-3">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search for arts product"
              aria-label="Search for arts product"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 p-1"
            />
          </div>
        </div>

        {/* Right - icons */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Small-screen search toggle */}
          <button
            aria-label="Open search"
            title="Search"
            onClick={() => setMobileSearchOpen((s) => !s)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white"
          >
            <SearchIcon className="w-4 h-4 text-white" />
          </button>

          <button
            title="Change language"
            aria-label="Change language"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent"
          >
            <span className="w-7 h-7 rounded-full bg-gradient-to-b from-[#2b87d9] to-[#ffd900] border-2 border-white/90" />
          </button>

          <button title="Profile" aria-label="Open profile" className="w-10 h-10 rounded-lg bg-white/8 text-white flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </button>

          <button title="Cart" aria-label="View cart" className="relative w-10 h-10 rounded-lg bg-white/8 text-white flex items-center justify-center">
            <BagIcon className="w-5 h-5 text-white" />
            <span className="absolute -right-1 -top-1 bg-white text-gray-900 text-xs rounded-full px-1.5 shadow">{cartCount}</span>
          </button>
        </div>

      {/* Mobile search area (simple overlay below navbar) */}
      {mobileSearchOpen && (
        <div className="mt-3 md:hidden">
          <div className="w-full px-2">
            <div className="w-full bg-white/95 rounded-xl px-3 py-2 flex items-center shadow-sm">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
              <input
                type="search"
                placeholder="Search for arts product"
                aria-label="Search for arts product"
                className="flex-1 bg-transparent outline-none text-sm text-gray-800"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </header>
  )
}