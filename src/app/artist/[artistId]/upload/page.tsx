import React from 'react';
import UploadArtForm from '@/components/UploadArtForm';

export default function ArtistUploadPage(props: any) {
  // Accept loose props to satisfy Next's generated type checks. Prefer
  // props.params.artistId but fall back to a safe placeholder.
  const artistId = props?.params?.artistId ?? 'unknown';
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Upload Artwork for {artistId}</h1>
      <UploadArtForm />
    </main>
  );
}
