# CalGeo Paywall System - Setup Complete! ✅

## What's Been Implemented

✅ **Stripe Integration**
- Stripe package installed
- Paywall system component created (`app/components/paywall-system.jsx`)
- Checkout API route (`app/api/checkout/route.js`)
- Webhook handler (`app/api/webhooks/stripe/route.js`)

✅ **Tier System**
- **Free**: 2 AI scans lifetime
- **Pro**: $4.99/month, 25 scans/month
- **Expert**: $9.99/month, unlimited scans

✅ **Features Integrated**
- PaywallModal component at bottom of app
- User ID generation and persistence
- Tier and scan count tracking in localStorage
- Upgrade redirect handling (/?upgraded=pro)

## Next Steps to Go Live

### 1. Set Up Stripe Account (15 minutes)

1. Go to https://dashboard.stripe.com/
2. Create account if you don't have one
3. **Create Products in Stripe Dashboard**:

   **Product 1: CalGeo Pro**
   - Name: CalGeo Pro
   - Price: $4.99/month (recurring)
   - Copy the **Price ID** (looks like `price_xxxxx`)

   **Product 2: CalGeo Expert**
   - Name: CalGeo Expert
   - Price: $9.99/month (recurring)
   - Copy the **Price ID** (looks like `price_xxxxx`)

4. **Get API Keys**:
   - Go to Developers → API Keys
   - Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)

5. **Set Up Webhook**:
   - Go to Developers → Webhooks
   - Click "+ Add endpoint"
   - URL: `https://calgeo.vercel.app/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

### 2. Add Environment Variables to Vercel (5 minutes)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 6 variables:

```
STRIPE_SECRET_KEY=sk_test_xxxxx (or sk_live_xxxxx for production)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx (or pk_live_xxxxx for production)
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_EXPERT=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_URL=https://calgeo.vercel.app
```

After adding, **redeploy the app** so environment variables take effect.

### 3. Test the Paywall (10 minutes)

1. Open https://calgeo.vercel.app
2. Test the upgrade flow:
   - Click "💎 Upgrade Tier" in menu
   - OR try to use a locked feature
   - Click "⭐ Pro" or "💎 Expert"
   - Should redirect to Stripe checkout
3. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
4. Complete checkout
5. Should redirect back with tier upgraded

### 4. Optional: Create Promo Codes

In Stripe Dashboard → Products → Coupons:
- `LAUNCH50` - 50% off first month
- `EXPERT30` - 30% off Expert tier
- `FRIEND20` - 20% off referral

## Current Feature Gating (Ready to Enable)

The paywall system is ready to gate these features:

### Available Helper Functions
- `hasFeature(userTier, 'feature_name')` - Check if tier has feature
- `canUseScan(userTier, scanCount)` - Check if can use AI scan
- `isJadeColorLocked(userTier, colorValue)` - Check if jade color locked

### Features to Gate (When You're Ready)

**Charm Calculator** - Lock with:
```jsx
if (!hasFeature(userTier, 'charm_combo')) {
  setPaywallFeature('charm_combo');
  setShowPaywall(true);
  return;
}
```

**AI Scan** - Lock with:
```jsx
if (!canUseScan(userTier, scanCount)) {
  setPaywallFeature('ai_scan');
  setShowPaywall(true);
  return;
}
// After successful scan:
setScanCount(scanCount + 1);
```

**History** - Lock with:
```jsx
if (!hasFeature(userTier, 'history')) {
  setPaywallFeature('history');
  setShowPaywall(true);
  return;
}
```

**Negotiation Targets** - Wrap with:
```jsx
{hasFeature(userTier, 'negotiation_targets') ? (
  <div>Targets here</div>
) : (
  <LockedOverlay
    feature="negotiation_targets"
    onClick={() => { setPaywallFeature('negotiation_targets'); setShowPaywall(true); }}
  >
    <div>Blurred targets</div>
  </LockedOverlay>
)}
```

## Launch Checklist

- [ ] Stripe products created (Pro $4.99, Expert $9.99)
- [ ] Environment variables added to Vercel
- [ ] Vercel redeployed with new env vars
- [ ] Webhook endpoint configured in Stripe
- [ ] Test purchase with Stripe test card works
- [ ] Upgrade redirects back and sets tier correctly
- [ ] Tier persists after page refresh
- [ ] Switch from test mode to live mode when ready
- [ ] Add promo codes (optional)
- [ ] Enable feature gating as needed

## Files Created

- `app/components/paywall-system.jsx` - Paywall UI and logic
- `app/api/checkout/route.js` - Stripe checkout session creator
- `app/api/webhooks/stripe/route.js` - Stripe webhook handler
- `PAYWALL_SETUP_NEXT_STEPS.md` - This file

## Support

For help with Stripe setup:
- Stripe Docs: https://stripe.com/docs
- CalGeo repo: https://github.com/Bdavisga/Claude

Good luck with your launch! 🚀
