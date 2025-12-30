// ============================================================
// app/api/webhooks/stripe/route.js
// Stripe Webhook Handler
// ============================================================

import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

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
      const email = session.metadata?.email || session.customer_email;

      console.log(`✅ NEW SUBSCRIBER: ${userId || email} -> ${tier}`);

      // Update user tier in Supabase
      if (userId) {
        try {
          const { error } = await supabaseAdmin
            .from('users')
            .update({
              tier: tier || 'pro',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              subscription_status: 'active',
              scan_count: 0, // Reset scan count on upgrade
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (error) {
            console.error('Error updating user in database:', error);
          } else {
            console.log(`✅ Database updated: ${userId} -> ${tier}`);
          }
        } catch (err) {
          console.error('Database update failed:', err);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customerId = sub.customer;

      console.log(`❌ SUBSCRIPTION CANCELED: ${customerId}`);

      // Downgrade user to free tier
      try {
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            tier: 'free',
            subscription_status: 'canceled',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error downgrading user:', error);
        } else {
          console.log(`✅ User downgraded to free: ${customerId}`);
        }
      } catch (err) {
        console.error('Downgrade failed:', err);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const customerId = sub.customer;
      const status = sub.status; // active, past_due, canceled, etc.

      console.log(`🔄 SUBSCRIPTION UPDATED: ${customerId} -> ${status}`);

      try {
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
      } catch (err) {
        console.error('Status update failed:', err);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      console.log(`⚠️ PAYMENT FAILED: ${invoice.customer_email}`);

      // Update subscription status to past_due
      try {
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating payment status:', error);
        }
      } catch (err) {
        console.error('Payment status update failed:', err);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
