import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try goldprice.org free API (no key required, real-time prices)
    const response = await fetch('https://data-asg.goldprice.org/dbXRates/USD');

    if (response.ok) {
      const data = await response.json();

      // goldprice.org returns price per troy ounce in xauPrice/xagPrice
      // Convert to price per gram (1 troy oz = 31.1035 grams)
      if (data?.items && data.items.length > 0) {
        const priceData = data.items[0]; // First item has USD prices

        if (priceData.xauPrice && priceData.xagPrice) {
          const goldPerGram = priceData.xauPrice / 31.1035;
          const silverPerGram = priceData.xagPrice / 31.1035;

          return NextResponse.json({
            price_per_gram: parseFloat(goldPerGram.toFixed(2)),
            silver_per_gram: parseFloat(silverPerGram.toFixed(2)),
            source: 'goldprice.org',
            timestamp: new Date().toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.error('GoldPrice.org API error:', error);
  }

  // Try alternative: frankfurter.app for currency rates
  try {
    // This API provides XAU (gold) rates against USD
    const response = await fetch('https://api.frankfurter.app/latest?from=XAU&to=USD');

    if (response.ok) {
      const data = await response.json();

      // Frankfurter gives us USD per troy ounce of gold
      if (data?.rates?.USD) {
        const pricePerOz = data.rates.USD;
        const goldPerGram = pricePerOz / 31.1035;

        return NextResponse.json({
          price_per_gram: parseFloat(goldPerGram.toFixed(2)),
          silver_per_gram: 1.02, // Approximate current silver price per gram
          source: 'frankfurter.app',
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error('Frankfurter API error:', error);
  }

  // Fallback to current market prices (updated Dec 2024)
  return NextResponse.json({
    price_per_gram: 85.50, // Current gold ~$2660/oz = $85.50/gram
    silver_per_gram: 1.02,  // Current silver ~$31.50/oz = $1.02/gram
    source: 'cached',
    timestamp: new Date().toISOString(),
  });
}
