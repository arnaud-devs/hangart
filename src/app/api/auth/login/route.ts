import { NextResponse } from 'next/server'

// Development-only auth stub. Accepts JSON { email, password }.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}

    // Simple demo check
    if (email === 'test@example.com' && password === 'password') {
      return NextResponse.json({ ok: true, token: 'demo-token', user: { email } })
    }

    return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) }, { status: 400 })
  }
}
