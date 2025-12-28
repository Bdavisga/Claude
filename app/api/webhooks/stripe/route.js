// ============================================================
// app/api/webhooks/stripe/route.js
// Stripe Webhook Handler
// ============================================================

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Initialize Stripe with API key check
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const tier = session.metadata?.tier;
      const userId = session.metadata?.userId;

      console.log(`✅ NEW SUBSCRIBER: ${userId} -> ${tier}`);

      // TODO: Update user in your database
      // await db.users.update({ id: userId }, { tier });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      console.log(`❌ CANCELED: ${sub.customer}`);

      // TODO: Downgrade user to free
      // await db.users.update({ stripeId: sub.customer }, { tier: 'free' });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log(`⚠️ PAYMENT FAILED: ${invoice.customer_email}`);

      // TODO: Send email, give grace period
      break;
    }
  }

  return NextResponse.json({ received: true });
}
