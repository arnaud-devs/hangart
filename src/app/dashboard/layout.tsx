// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Sidebar } from "@/components/dashboard/sidebar"; 
import { Header } from "@/components/dashboard/header";
// EnsureDemoUser removed - demo helpers cleaned up
import { useAuth } from '@/lib/authProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { signOut, user, loading } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  // Debug: Log user info
  useEffect(() => {
    // Debug logs removed to reduce console noise in dev.
  }, [user, loading]);

  // Protect dashboard: only admin and artist can access
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Auth check disabled for development
    // Uncomment to re-enable authentication
    /*
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const userRole = (user.role || '').toString().toLowerCase();
        if (userRole === 'buyer') {
          router.push('/');
        }
      }
    }
    */
  }, [mounted, user, loading, router]);

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

  // Redirect if not authenticated or if buyer role
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

  const userRole = (user.role || '').toString().toLowerCase();
  if (userRole === 'buyer') {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Buyers do not have access to the dashboard.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col lg:ml-72">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}