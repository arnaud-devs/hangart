import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://hangart.pythonanywhere.com/api';

// Adjusted signature for Next.js 16: context.params may be a Promise per validator typing
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ ok: false, message: 'Missing user_id' }, { status: 400 });

    const res = await fetch(`${BASE_URL}/profiles/artist/${encodeURIComponent(id)}/`, {
      method: 'GET',
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, ...data }, { status: res.status });
    return NextResponse.json({ ok: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 });
  }
}
