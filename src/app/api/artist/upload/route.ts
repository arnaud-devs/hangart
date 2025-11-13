import { NextResponse } from 'next/server'

// Minimal development-only upload handler.
// Accepts multipart/form-data POSTs and returns a JSON summary of received fields/files.
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Read some common fields (optional)
    const title = formData.get('title')
    const description = formData.get('description')
    const price = formData.get('price')

    // Collect files sent as `images` (can be multiple)
    // formData.getAll may return File-like objects in the runtime
    const rawFiles = formData.getAll('images')
    const files = rawFiles.map((f: any) => ({
      name: f?.name ?? null,
      size: typeof f?.size === 'number' ? f.size : null,
      type: f?.type ?? null,
    }))

    // For development we don't persist uploaded files. Return a small summary so the client can verify.
    return NextResponse.json({
      ok: true,
      received: {
        title: title ?? null,
        description: description ?? null,
        price: price ?? null,
        fileCount: files.length,
        files,
      },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
