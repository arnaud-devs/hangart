import { NextResponse } from 'next/server';
import sampleArtists from '@/data/SampleArtists';
import sampleArtworks from '@/data/SampleArtworks';

// Relax the typed context to avoid type-check mismatches in Next's generated helpers
export async function GET(request: Request, context: any) {
  // Prefer context.params.artistId, fall back to parsing the URL path
  const artistId = context?.params?.artistId ?? new URL(request.url).pathname.split('/').pop();
  const artist = sampleArtists.find((a) => String(a.id) === String(artistId));
  if (!artist) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Attach artworks data if available
  const artworks = (artist.artworks || []).map((id) => sampleArtworks.find((s) => String(s.id) === String(id))).filter(Boolean);

  return NextResponse.json({ ...artist, artworks });
}
