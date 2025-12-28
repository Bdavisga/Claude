import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // This would require Google Places API key
    // For now, return mock data or implement when ready

    // Mock response - replace with actual Google Places API call
    const mockResults = [
      {
        placeId: '1',
        name: query,
        address: '123 Main St, New York, NY',
        rating: 4.5,
      },
    ];

    return NextResponse.json({
      results: mockResults,
      source: 'mock',
    });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json({ results: [], error: error.message });
  }
}
