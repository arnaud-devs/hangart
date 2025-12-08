"use client";

import React from "react";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
        <h1>Shipping & Returns</h1>
        <h2>Shipping</h2>
        <p>Orders ship within 5-7 business days unless otherwise stated. Tracking is provided when available.</p>
        <h2>Returns</h2>
        <p>Returns accepted within 14 days of delivery in original condition. Contact support before returning.</p>
        <h2>Duties & Taxes</h2>
        <p>International orders may incur duties or taxes, payable by the recipient.</p>
      </div>
    </main>
  );
}
