# Google Maps API Setup Guide

Your CalGeo app needs a Google Maps API key to display the jewelry store locator map.

## Quick Setup (5 minutes)

### Step 1: Get a Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/google/maps-apis

2. **Create or Select a Project**
   - Click "Select a project" dropdown at the top
   - Click "NEW PROJECT"
   - Name it "CalGeo" or your preferred name
   - Click "CREATE"

3. **Enable Required APIs**
   - In the search bar, type "Maps JavaScript API"
   - Click on it and press "ENABLE"
   - Go back and search for "Places API"
   - Click on it and press "ENABLE"

4. **Create API Key**
   - Click "Credentials" in the left sidebar
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "API key"
   - Copy the API key (it looks like: `AIzaSyD...`)

5. **Secure Your API Key (Recommended)**
   - Click "EDIT API KEY" (or the pencil icon)
   - Under "Application restrictions":
     - For **local development**: Choose "HTTP referrers"
       - Add: `http://localhost:3000/*`
     - For **production**: Add your Vercel domain:
       - Add: `https://your-app.vercel.app/*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: "Maps JavaScript API" and "Places API"
   - Click "SAVE"

### Step 2: Add API Key to Your App

1. **Open `.env.local` file** in your project root
2. **Find this line:**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```
3. **Replace `YOUR_API_KEY_HERE` with your actual API key:**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyD_your_actual_key_here
   ```
4. **Save the file**

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test the Map

1. Open http://localhost:3000
2. Click the "Tools" tab (🔧)
3. Click "Map" at the top
4. You should see a Google Map with jewelry stores!

## Important Notes

### Billing Setup (Required for Production)

Google requires a billing account, but includes **$200 free credit every month**. For most apps, this is more than enough.

1. Go to: https://console.cloud.google.com/billing
2. Click "ADD BILLING ACCOUNT"
3. Enter your payment information
4. Link the billing account to your "CalGeo" project

**Don't worry:** You won't be charged unless you exceed the free tier ($200/month credit).

### Monthly Free Tier Includes:
- **Maps JavaScript API**: 28,000 loads per month
- **Places API**:
  - Nearby Search: 5,000 requests/month
  - Place Details: 5,000 requests/month
  - Find Place: 5,000 requests/month

This is plenty for most small to medium apps!

### Cost Estimates for CalGeo

Assuming 100 active users per day:
- Map loads: ~3,000/month = **FREE** (under 28,000)
- Places searches: ~1,500/month = **FREE** (under 5,000)

**Total cost: $0** (well within free tier!)

## Deployment to Vercel

When deploying to Vercel:

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add:
   - **Key**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: Your API key
   - **Environments**: Check all (Production, Preview, Development)
4. Click "Save"
5. Redeploy your app

## Troubleshooting

### Map shows gray box with "For development purposes only"
- **Issue**: Billing not enabled
- **Fix**: Add a billing account (see above)

### "RefererNotAllowedMapError"
- **Issue**: Domain restriction
- **Fix**: Add your domain to HTTP referrers in API key settings

### Console shows "Google Maps failed to load"
- **Issue**: API key invalid or APIs not enabled
- **Fix**:
  1. Check API key is correct in `.env.local`
  2. Verify Maps JavaScript API and Places API are enabled
  3. Restart dev server

### Map doesn't show after adding key
- **Issue**: Environment variable not loaded
- **Fix**:
  1. Ensure file is named `.env.local` (not `.env`)
  2. Restart dev server completely
  3. Clear browser cache

## Need Help?

- **Google Maps Documentation**: https://developers.google.com/maps/documentation
- **API Key Best Practices**: https://developers.google.com/maps/api-security-best-practices
- **Pricing Calculator**: https://mapsplatform.google.com/pricing/

---

**Current Status**: ⚠️ API key not configured

Once you add your API key and restart the server, the map will work perfectly! 🗺️
