import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to fetch from free metals API
    const response = await fetch('https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=g');

    if (response.ok) {
      const data = await response.json();

      // Extract gold and silver prices per gram
      const goldPerGram = data?.metals?.gold || null;
      const silverPerGram = data?.metals?.silver || null;

      if (goldPerGram) {
        return NextResponse.json({
          price_per_gram: parseFloat(goldPerGram.toFixed(2)),
          silver_per_gram: silverPerGram ? parseFloat(silverPerGram.toFixed(2)) : 0.98,
          source: 'metals.dev',
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error('Metals API error:', error);
  }

  // Try alternative free API
  try {
    const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU,XAG');

    if (response.ok) {
      const data = await response.json();

      // These APIs return price of 1 USD in troy oz of gold/silver
      // We need to invert and convert to grams
      if (data?.rates?.XAU) {
        const ozPerDollar = data.rates.XAU;
        const pricePerOz = 1 / ozPerDollar;
        const pricePerGram = pricePerOz / 31.1035;

        const silverPricePerGram = data?.rates?.XAG
          ? (1 / data.rates.XAG) / 31.1035
          : 0.98;

        return NextResponse.json({
          price_per_gram: parseFloat(pricePerGram.toFixed(2)),
          silver_per_gram: parseFloat(silverPricePerGram.toFixed(2)),
          source: 'metalpriceapi',
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error('MetalPrice API error:', error);
  }

  // Fallback to cached/default prices (current market estimate)
  return NextResponse.json({
    price_per_gram: 84.20, // Default gold price per gram (~$2600/oz)
    silver_per_gram: 0.98,  // Default silver price per gram (~$30/oz)
    source: 'cached',
    timestamp: new Date().toISOString(),
  });
}
