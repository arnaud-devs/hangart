"use client";

import React, { useEffect, useState } from 'react';

type Settings = {
  siteName: string;
  allowRegistration: boolean;
};

const KEY = 'adminSettings';

export default function Page() {
  const [settings, setSettings] = useState<Settings>({ siteName: 'Hangart', allowRegistration: true });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch (e) {}
  }, []);

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
      alert('Settings saved');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input value={settings.siteName} onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>

            <div className="flex items-center gap-3">
              <input id="reg" type="checkbox" checked={settings.allowRegistration} onChange={e => setSettings(s => ({ ...s, allowRegistration: e.target.checked }))} />
              <label htmlFor="reg" className="text-sm text-gray-700">Allow new user registration</label>
            </div>

            <div className="flex justify-end">
              <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
