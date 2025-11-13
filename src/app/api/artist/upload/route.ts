import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // Example: read fields
    const title = formData.get('title');
    const description = formData.get('description');
    const files = formData.getAll('images');

    // For now, just echo back a success response with counts
    return NextResponse.json({ ok: true, received: { title, description, files: files.length } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
