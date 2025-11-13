import { NextResponse } from 'next/server';
import sampleArtworks from '@/data/SampleArtworks';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const found = sampleArtworks.find((a) => String(a.id) === String(id));

  if (!found) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.json(found);
}
