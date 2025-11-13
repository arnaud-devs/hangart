import React from 'react';
import UploadArtForm from '@/components/UploadArtForm';

export default function ArtistUploadPage({ params }: { params: { artistId: string } }) {
  const { artistId } = params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Upload Artwork for {artistId}</h1>
      <UploadArtForm />
    </main>
  );
}
