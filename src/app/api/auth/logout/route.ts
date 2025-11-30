import { NextResponse } from 'next/server'

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  // Clear cookies
  res.cookies.set('access_token', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  res.cookies.set('refresh_token', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
