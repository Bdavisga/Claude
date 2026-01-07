// ============================================================
// app/api/checkout/route.js
// Stripe Checkout Session Creator
// ============================================================

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Initialize Stripe with API key check
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { tier, userId, email, discount } = await request.json();

    // Validate tier
    if (!['pro', 'expert'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Price IDs from your Stripe Dashboard
    // Create these products first in Stripe!
    const prices = {
      pro: process.env.STRIPE_PRICE_PRO,       // $4.99/mo
      expert: process.env.STRIPE_PRICE_EXPERT, // $9.99/mo
    };

    const priceId = prices[tier];
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
    }

    // Handle discount coupon for first-time visitors
    let couponId = null;
    if (discount && discount > 0 && discount <= 100) {
      try {
        // Try to retrieve existing coupon first
        const existingCoupons = await stripe.coupons.list({ limit: 100 });
        const existingCoupon = existingCoupons.data.find(c =>
          c.percent_off === discount &&
          c.name === `CalGeo First Visit ${discount}% Off`
        );

        if (existingCoupon) {
          couponId = existingCoupon.id;
        } else {
          // Create new coupon
          const coupon = await stripe.coupons.create({
            percent_off: discount,
            duration: 'once',
            name: `CalGeo First Visit ${discount}% Off`,
          });
          couponId = coupon.id;
        }
      } catch (couponError) {
        console.error('Coupon creation error:', couponError);
        // Continue without discount if coupon fails
      }
    }

    // Build checkout session configuration
    const sessionConfig = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],

      // URLs - update with your domain
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://calgeo.vercel.app'}/?upgraded=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://calgeo.vercel.app'}/?canceled=true`,

      // Trial period - let users try before buying
      subscription_data: {
        trial_period_days: tier === 'pro' ? 3 : 7,
        metadata: { tier, userId: userId || 'anon', email: email || '' },
      },

      // Allow promo codes
      allow_promotion_codes: true,

      // Metadata for tracking
      metadata: {
        tier,
        userId: userId || 'anon',
        source: 'calgeo_app',
        email: email || '',
        firstVisitDiscount: discount ? `${discount}%` : 'none',
      },
    };

    // Add customer email if provided
    if (email) {
      sessionConfig.customer_email = email;
    }

    // Apply discount if coupon was created
    if (couponId) {
      sessionConfig.discounts = [{ coupon: couponId }];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
