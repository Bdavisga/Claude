import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to fetch from Gold API
    const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'goldapi-YOUR_API_KEY', // Replace with actual API key
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Convert price per troy ounce to price per gram
      // 1 troy ounce = 31.1035 grams
      const pricePerOunce = data.price || 2400; // Default fallback
      const pricePerGram = pricePerOunce / 31.1035;

      return NextResponse.json({
        price_per_gram: parseFloat(pricePerGram.toFixed(2)),
        silver_per_gram: 0.98, // Placeholder for silver
        source: 'api',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Gold API error:', error);
  }

  // Fallback to cached/default prices
  return NextResponse.json({
    price_per_gram: 84.20, // Default gold price per gram
    silver_per_gram: 0.98,  // Default silver price per gram
    source: 'cached',
    timestamp: new Date().toISOString(),
  });
}
