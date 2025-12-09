"use client";

import { Search, Bell, ChevronDown, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { FiUser } from 'react-icons/fi';

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  role: string;
  phone?: string;
  is_verified?: boolean;
  join_date?: string;
  profileImage?: string | null;
  admin_profile?: any;
  artist_profile?: any;
  buyer_profile?: any;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export const Header = ({ sidebarOpen, setSidebarOpen, onLogout }: HeaderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          id: parsedUser.id,
          email: parsedUser.email,
          first_name: parsedUser.first_name,
          last_name: parsedUser.last_name,
          username: parsedUser.username,
          role: parsedUser.role,
          phone: parsedUser.phone,
          is_verified: parsedUser.is_verified,
          join_date: parsedUser.join_date,
          profileImage: parsedUser.profileImage || null,
          admin_profile: parsedUser.admin_profile,
          artist_profile: parsedUser.artist_profile,
          buyer_profile: parsedUser.buyer_profile
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  // Close dropdown when route changes
  const pathname = usePathname();
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = () => {
    // Clear localStorage and reset user state
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    setDropdownOpen(false);
  };

  return (
    <header className="sticky w-full top-0 z-50 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu and Search */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:block ml-4 lg:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            <div className="px-1">
              <ThemeToggle />
            </div>

            <button 
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.first_name || ''} ${user.last_name || ''}`}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-700 shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {user.first_name?.charAt(0).toUpperCase()}{user.last_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <span className="ml-2 hidden md:inline-block text-gray-700 font-medium">
                    {user.first_name}
                  </span>
                  <ChevronDown className={`ml-1 w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1" role="menu">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs mt-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full inline-block">
                          {user.role}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="w-4 h-4 mr-2" />
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          const fn = onLogout ?? handleLogout;
                          try { fn(); } catch (e) { handleLogout(); }
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
};