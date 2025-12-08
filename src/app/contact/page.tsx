"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Thanks! We'll get back to you shortly.");
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Send us a message and our team will respond as soon as possible.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div>
            <label className="block text-sm mb-1" htmlFor="name">Name</label>
            <input id="name" className="w-full px-3 py-2 rounded border dark:bg-gray-700" required />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 rounded border dark:bg-gray-700" required />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="message">Message</label>
            <textarea id="message" className="w-full px-3 py-2 rounded border dark:bg-gray-700" rows={5} required />
          </div>
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
        </form>
        {status && <p className="mt-4 text-green-700 dark:text-green-400">{status}</p>}
      </div>
    </main>
  );
}
