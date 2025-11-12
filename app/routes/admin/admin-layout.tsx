import React from 'react'
import { Outlet } from 'react-router';
import { SidebarProvider } from '~/components/ui/sidebar';
import { AppSidebar } from '../../../components/AdminDashoard/app-sidebar';
import { Ghost } from 'lucide-react';
const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="admin-layout">
        <aside>
          <AppSidebar />
        </aside>

        <main className="children">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout