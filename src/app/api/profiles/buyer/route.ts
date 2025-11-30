import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BASE_URL = 'https://hangart.pythonanywhere.com/api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get('access_token')?.value;
    if (!access) return NextResponse.json({ ok: false, message: 'Not authenticated' }, { status: 401 });

    const res = await fetch(`${BASE_URL}/profiles/buyer/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, ...data }, { status: res.status });
    return NextResponse.json({ ok: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const access = cookieStore.get('access_token')?.value;
    if (!access) return NextResponse.json({ ok: false, message: 'Not authenticated' }, { status: 401 });

    const contentType = req.headers.get('content-type') || '';

    let body: BodyInit | null = null;
    let headers: Record<string, string> = { Authorization: `Bearer ${access}` };

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const fd = new FormData();
      for (const [key, value] of form.entries()) {
        fd.append(key, value as any);
      }
      body = fd;
    } else {
      const json = await req.json();
      body = JSON.stringify(json);
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${BASE_URL}/profiles/buyer/`, {
      method: 'PATCH',
      headers,
      body,
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ ok: false, ...data }, { status: res.status });
    return NextResponse.json({ ok: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 });
  }
}
