"use client";

import React from "react";

const faqs = [
  { q: "How do I buy an artwork?", a: "Add to cart and proceed to checkout. You'll receive confirmation by email." },
  { q: "Do you ship internationally?", a: "Yes, shipping times may vary by destination." },
  { q: "Are artworks authentic?", a: "All artworks are verified from our network of artists." },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">FAQ</h1>
        <ul className="space-y-4">
          {faqs.map((f, i) => (
            <li key={i} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
              <h2 className="font-semibold mb-1">{f.q}</h2>
              <p className="text-gray-700 dark:text-gray-300">{f.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
