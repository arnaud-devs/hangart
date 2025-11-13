import { NextResponse } from 'next/server';
import sampleArtists from '@/data/SampleArtists';
import sampleArtworks from '@/data/SampleArtworks';

export async function GET(request: Request, { params }: { params: { artistId: string } }) {
  const { artistId } = params;
  const artist = sampleArtists.find((a) => a.id === artistId);
  if (!artist) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Attach artworks data if available
  const artworks = (artist.artworks || []).map((id) => sampleArtworks.find((s) => String(s.id) === String(id))).filter(Boolean);

  return NextResponse.json({ ...artist, artworks });
}
