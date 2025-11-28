// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
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

  return (
    <div className="flex min-h-full w-full bg-gray-50">
      <EnsureDemoUser />
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 max-w-screen px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}