// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Sidebar } from "@/components/dashboard/sidebar"; 
import { Header } from "@/components/dashboard/header";
import EnsureDemoUser from '@/components/EnsureDemoUser';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    // navigate to login
    router.push('/login');
  };

  // keep theme in sync when entering dashboard (client-side only)
  // this ensures the dashboard respects the persisted preference immediately
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
