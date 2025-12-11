"use client";
import React from 'react';
import PaymentPage from '@/components/small/Payments';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function PaymentRoutePage({ params }: PageProps) {
  // Use React.use() to unwrap the params Promise
  const { orderId } = React.use(params);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <PaymentPage orderId={orderId} />
      </div>
    </div>
  );
}