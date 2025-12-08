// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Sidebar } from "@/components/dashboard/sidebar"; 
import { Header } from "@/components/dashboard/header";
import EnsureDemoUser from '@/components/EnsureDemoUser';
import { useAuth } from '@/lib/authProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { signOut, user, loading } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  // Debug: Log user info
  useEffect(() => {
    // Debug logs removed to reduce console noise in dev.
  }, [user, loading]);

  // TEMPORARY FIX: Allow users with empty roles for testing
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Keep theme in sync
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? (localStorage.getItem('theme') || null) : null;
      let theme = saved;
      if (!theme && typeof window !== 'undefined' && window.matchMedia) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="animate-pulse">Loading authentication...</div>
      </div>
    );
  }

  // Allow non-admin roles (artist, buyer, museum) to access dashboard area.

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Please Log In
          </h1>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <EnsureDemoUser />
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 w-full h-full max-w-screen py-8">
          {children}
        </main>
      </div>
    </div>
  );
}