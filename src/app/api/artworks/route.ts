import { NextResponse } from 'next/server';
import sampleArtworks, { Artwork } from '@/data/SampleArtworks';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const artist = url.searchParams.get('artist') || undefined;
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.max(0, Number(limitParam)) : undefined;

  let results: Artwork[] = sampleArtworks;

  if (artist) {
    const lower = artist.toLowerCase();
    results = results.filter((a) => (a.artistName || '').toLowerCase().includes(lower));
  }

  if (typeof limit === 'number') {
    results = results.slice(0, limit);
  }

  return NextResponse.json(results);
}
