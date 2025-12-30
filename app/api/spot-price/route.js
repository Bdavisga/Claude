import { NextResponse } from 'next/server';

export async function GET() {
  // Try GoldAPI.io first (official LBMA/COMEX data)
  const apiKey = process.env.GOLDAPI_KEY;

  if (apiKey) {
    try {
      // Fetch both gold (XAU) and silver (XAG) prices in parallel
      const [goldResponse, silverResponse] = await Promise.all([
        fetch('https://www.goldapi.io/api/XAU/USD', {
          headers: { 'x-access-token': apiKey }
        }),
        fetch('https://www.goldapi.io/api/XAG/USD', {
          headers: { 'x-access-token': apiKey }
        })
      ]);

      if (goldResponse.ok && silverResponse.ok) {
        const goldData = await goldResponse.json();
        const silverData = await silverResponse.json();

        // GoldAPI.io returns price per troy ounce
        // Convert to price per gram (1 troy oz = 31.1035 grams)
        if (goldData?.price && silverData?.price) {
          const goldPerGram = goldData.price / 31.1035;
          const silverPerGram = silverData.price / 31.1035;

          return NextResponse.json({
            price_per_gram: parseFloat(goldPerGram.toFixed(2)),
            silver_per_gram: parseFloat(silverPerGram.toFixed(2)),
            source: 'goldapi.io',
            timestamp: goldData.timestamp || new Date().toISOString(),
            raw_data: {
              gold_oz: goldData.price,
              silver_oz: silverData.price
            }
          });
        }
      }
    } catch (error) {
      console.error('GoldAPI.io error:', error);
    }
  }

  // Fallback to goldprice.org free API (no key required)
  try {
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
