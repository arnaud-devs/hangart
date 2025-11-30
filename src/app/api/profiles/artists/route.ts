import { NextResponse } from 'next/server'

const BASE_URL = 'https://hangart.pythonanywhere.com/api';

// Public list of artists with optional filters via query params
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const country = url.searchParams.get('country') || '';
    const specialization = url.searchParams.get('specialization') || '';

    const backendUrl = new URL(`${BASE_URL}/profiles/artists/`);
    if (q) backendUrl.searchParams.set('q', q);
    if (country) backendUrl.searchParams.set('country', country);
    if (specialization) backendUrl.searchParams.set('specialization', specialization);

    const res = await fetch(backendUrl.toString(), { method: 'GET' });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, ...data }, { status: res.status });
    return NextResponse.json({ ok: true, results: data?.results ?? data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 });
  }
}
