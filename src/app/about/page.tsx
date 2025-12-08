"use client";

import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
        <h1>About Us</h1>
        <p>
          Hangart connects art lovers with emerging artists worldwide. Our mission is to make discovering and collecting art simple,
          transparent, and enjoyable.
        </p>
        <h2>What We Do</h2>
        <ul>
          <li>Curate artworks from verified artists</li>
          <li>Offer secure checkout and transparent pricing</li>
          <li>Support artists through fair revenue sharing</li>
        </ul>
        <h2>Contact</h2>
        <p>
          Have questions? Visit our <a href="/contact">Contact</a> page.
        </p>
      </div>
    </main>
  );
}
