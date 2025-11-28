"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setFirstName(parsed.firstName || "");
        setLastName(parsed.lastName || "");
        setEmail(parsed.email || "");
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function save() {
    setSaving(true);
    try {
      const next = { ...(user || {}), firstName, lastName, email };
      localStorage.setItem("user", JSON.stringify(next));
      setUser(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Update your profile details used by the demo account.</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">First name</span>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Last name</span>
              <input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </label>

            <div className="flex items-center gap-3 mt-2">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                {saving ? "Saving..." : "Save"}
              </button>
              {saved && <span className="text-sm text-emerald-600 dark:text-emerald-300">Saved</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

