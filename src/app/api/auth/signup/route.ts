import { NextResponse } from 'next/server'

// Development-only signup stub. Accepts JSON { name, email, password }.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body || {}

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In development, just accept the signup
    // In production, you'd save to database, hash password, etc.
    return NextResponse.json({
      ok: true,
      message: 'Account created successfully',
      user: { name, email },
    })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: String(err?.message ?? err) },
      { status: 400 }
    )
  }
}
