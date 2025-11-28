"use client";

import { useEffect } from "react";

// This small helper ensures there's a demo `user` in localStorage.
// It is intentionally simple: in production your auth should populate this.
export default function EnsureDemoUser() {
  useEffect(() => {
    try {
      // Only write a demo user if none exists so demo logins can change the user
      const existing = localStorage.getItem('user');
      if (!existing) {
        const demo = {
          id: 'admin-01',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          role: 'ADMIN',
          profileImage: '/person-m-3.webp'
        };
        localStorage.setItem('user', JSON.stringify(demo));
      }
    } catch (e) {
      // ignore — localStorage may be unavailable in some test environments
    }
  }, []);

  return null;
}
