import { NextResponse } from 'next/server'

const BASE_URL = 'https://hangart.pythonanywhere.com/api';

// Proxies token refresh: expects { refresh }
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, ...data }, { status: res.status });
    }

    const access = data?.access;
    const response = NextResponse.json({ ok: true, ...data });
    if (access) {
      response.cookies.set('access_token', access, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 });
  }
}
