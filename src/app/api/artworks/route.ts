import { NextRequest } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const category = searchParams.get("category") || undefined;
    const medium = searchParams.get("medium") || undefined;
    const artist = searchParams.get("artist") || undefined;
    const search = searchParams.get("search") || undefined;
    const ordering = searchParams.get("ordering") || undefined;

    const backendUrl = new URL("/api/artworks/", BACKEND_BASE);
    backendUrl.searchParams.set("page", page);
    if (category) backendUrl.searchParams.set("category", category);
    if (medium) backendUrl.searchParams.set("medium", medium);
    if (artist) backendUrl.searchParams.set("artist", artist);
    if (search) backendUrl.searchParams.set("search", search);
    if (ordering) backendUrl.searchParams.set("ordering", ordering);

    // Forward cookies if present to allow role-based visibility (artist/admin)
    // Public users will just get approved + available by backend logic
    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.get("cookie") ? { cookie: req.headers.get("cookie")! } : {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch artworks",
          status: res.status,
          details: data,
        }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", message: e?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
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
