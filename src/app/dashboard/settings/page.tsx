"use client";

import React, { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

export default function Page() {
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("settings.notifications");
      if (raw !== null) setNotifications(raw === "true");
    } catch (e) {
      // ignore
    }
  }, []);

  function toggleNotifications() {
    const next = !notifications;
    setNotifications(next);
    try {
      localStorage.setItem("settings.notifications", String(next));
    } catch (e) {
      // ignore
    }
  }

  function logout() {
    try {
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
    router.push("/login");
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Application preferences and UI settings.</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Theme</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Toggle light / dark appearance.</div>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Email notifications</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Receive email updates.</div>
            </div>
            <label className="inline-flex items-center">
              <input type="checkbox" checked={notifications} onChange={toggleNotifications} className="form-checkbox h-5 w-5 text-emerald-600" />
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

