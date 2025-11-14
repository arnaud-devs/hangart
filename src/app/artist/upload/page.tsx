import React from 'react';
import UploadArtForm from '@/components/UploadArtForm';

export default function UploadPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Upload Artwork (dev)</h1>
      <UploadArtForm />
    </main>
  );
}
