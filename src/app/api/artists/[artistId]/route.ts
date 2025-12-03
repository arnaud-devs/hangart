import { NextResponse } from 'next/server';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://hangart.pythonanywhere.com/api';

// Proxy the request to the external API so the frontend can use a single origin
export async function GET(request: Request, context: any) {
  const artistId = context?.params?.artistId ?? new URL(request.url).pathname.split('/').pop();
  if (!artistId) return NextResponse.json({ error: 'Not found' }, { status: 400 });

  try {
    const res = await fetch(`${API_BASE}/profiles/artists/${artistId}/`);
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: res.status });
    const artist = await res.json();
    return NextResponse.json(artist);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 502 });
  }
}
