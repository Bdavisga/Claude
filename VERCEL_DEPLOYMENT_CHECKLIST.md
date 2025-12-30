# Vercel Deployment Checklist for CalGeo

## Error: "Application error: a client-side exception has occurred"

This error happens when environment variables are missing in Vercel.

## ✅ Environment Variables Checklist

### Required Variables (Must Add to Vercel)

Copy these to Vercel → Settings → Environment Variables:

#### Stripe Payment (Required for Pro/Expert tiers)
```
STRIPE_SECRET_KEY=<copy from .env.local>
STRIPE_PUBLISHABLE_KEY=<copy from .env.local>
STRIPE_PRICE_PRO=<copy from .env.local>
STRIPE_PRICE_EXPERT=<copy from .env.local>
STRIPE_WEBHOOK_SECRET=<copy from .env.local>
```

#### Application URL (UPDATE with your actual Vercel URL!)
```
NEXT_PUBLIC_URL=https://calgeo-i9kgqisq0-marketsavages-projects.vercel.app
```
**OR** use your custom domain if you have one:
```
NEXT_PUBLIC_URL=https://calgeo.yourdomain.com
```

#### Supabase Database (Required for auth & data storage)
```
NEXT_PUBLIC_SUPABASE_URL=<copy from .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<copy from .env.local>
```

#### Google Maps (Required for store locator map)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<copy from .env.local>
```

#### GoldAPI.io (Required for spot prices)
```
GOLDAPI_KEY=<copy from .env.local>
```

## 📝 Step-by-Step Instructions

### 1. Access Vercel Dashboard
- Go to: https://vercel.com/marketsavages-projects/calgeo
- Or click your project from: https://vercel.com/dashboard

### 2. Navigate to Environment Variables
- Click **Settings** (in the top navigation)
- Click **Environment Variables** (in the left sidebar)

### 3. Add Each Variable
For EACH variable listed above:

1. Click **"Add New"** button
2. Enter **Key** (e.g., `STRIPE_SECRET_KEY`)
3. Enter **Value** (copy from above)
4. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### 4. Verify All Variables Added
You should have **11 total variables**:
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_PRICE_PRO
- [ ] STRIPE_PRICE_EXPERT
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] NEXT_PUBLIC_URL
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- [ ] GOLDAPI_KEY

### 5. Redeploy
- Go to **Deployments** tab
- Find the latest deployment
- Click **"..."** menu (three dots)
- Click **"Redeploy"**
- Wait for deployment to complete (~2-3 minutes)

### 6. Test Your Deployment
- Visit: https://calgeo-i9kgqisq0-marketsavages-projects.vercel.app
- The app should now load without errors!

## 🔍 Troubleshooting

### Still Getting Errors?

1. **Check Browser Console**
   - Press F12 → Console tab
   - Look for specific error messages
   - Share the error with support

2. **Check Vercel Logs**
   - Go to Deployments → Click latest deployment
   - Click "Runtime Logs"
   - Look for error messages

3. **Verify Environment Variables**
   - Settings → Environment Variables
   - Make sure all 11 variables are there
   - Check for typos in variable names

### Common Issues

**Issue**: "Failed to load resource: the server responded with a status of 500"
- **Fix**: STRIPE_WEBHOOK_SECRET or GOLDAPI_KEY might be wrong

**Issue**: "Supabase client error"
- **Fix**: Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

**Issue**: Map not loading
- **Fix**: Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

## 🎯 Quick Verification

After redeploying, test these features:
- [ ] App loads without errors
- [ ] Spot prices refresh (shows "Source: goldapi.io")
- [ ] Login/Sign up works
- [ ] Gold calculator works
- [ ] Map shows jewelry stores
- [ ] Upgrade buttons work (redirect to Stripe)

## 📞 Need Help?

If you're still seeing errors after following this checklist:
1. Take a screenshot of the browser console (F12)
2. Take a screenshot of Vercel environment variables page
3. Share both screenshots

---

**Last Updated**: Dec 30, 2025
**Vercel URL**: https://calgeo-i9kgqisq0-marketsavages-projects.vercel.app
