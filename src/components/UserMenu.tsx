"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Home } from "lucide-react";
import { useAuth } from '@/lib/authProvider';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user: authUser, signOut } = useAuth();
  const [user, setUser] = useState<any>(authUser);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Subscribe to auth context user so menu updates reactively
  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    try {
      // Prefer auth provider signOut so context updates across app
      signOut();
    } catch (e) {
      // Fallback to clearing localStorage if provider is not available
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    } finally {
      setIsOpen(false);
    }
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || user.firstName || "";
    const lastName = user.last_name || user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-colors"
        style={{
          backgroundColor: user ? "#CA8A04" : "transparent",
        }}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {user ? (
          <span className="text-sm">{getInitials()}</span>
        ) : (
          <User className="text-gray-800 dark:text-[#DFDFD6]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.first_name || user?.firstName} {user?.last_name || user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              {(user?.role || user?.role === '') && (user.role?.toString().toLowerCase() === 'buyer') && (
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              )}
              {((user?.role || '') && (user.role?.toString().toLowerCase() === 'admin' || user.role?.toString().toLowerCase() === 'artist')) && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}