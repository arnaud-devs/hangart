"use client";

import React from "react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
        <h1>Support</h1>
        <p>
          Need help? Check the <Link href="/faq">FAQ</Link> or reach out via the <Link href="/contact">Contact</Link> page.
        </p>
        <h2>Response Times</h2>
        <p>We typically respond within 1-2 business days.</p>
      </div>
    </main>
  );
}
