import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BASE_URL = 'https://hangart.pythonanywhere.com/api';

export async function POST(req: Request) {
  try {
    const access = (await cookies()).get('access_token')?.value;
    if (!access) {
      return NextResponse.json({ ok: false, message: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${BASE_URL}/auth/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, ...data }, { status: res.status });
    }

    return NextResponse.json({ ok: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 500 });
  }
}
