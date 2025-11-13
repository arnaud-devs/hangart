import { NextResponse } from 'next/server';
import sampleArtworks from '@/data/SampleArtworks';

// Use a loose type for the context to avoid strict generated-type mismatches
// between Next's internal type helpers and our declared param shape.
export async function GET(request: Request, context: any) {
  // Try the usual context.params.id first, fall back to parsing the URL.
  const id = context?.params?.id ?? new URL(request.url).pathname.split('/').pop();
  const found = sampleArtworks.find((a) => String(a.id) === String(id));

  if (!found) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.json(found);
}
