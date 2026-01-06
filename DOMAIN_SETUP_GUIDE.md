# Setting Up calgeo.app Custom Domain

## Overview
This guide will connect your GoDaddy domain **calgeo.app** to your Vercel deployment.

**Timeline:** 10-15 minutes setup + 5-30 minutes DNS propagation

---

## Step 1: Add Environment Variables First

Before connecting the domain, add all environment variables to Vercel (see `VERCEL_ENV_VARIABLES.txt`).

**Critical:** The `NEXT_PUBLIC_URL` variable should be set to:
```
https://calgeo.app
```

---

## Step 2: Connect Domain in Vercel

### 2.1 Open Vercel Domain Settings
1. Go to: https://vercel.com/marketsavages-projects/calgeo/settings/domains
2. You'll see a field that says "example.com"

### 2.2 Add Your Domain
1. Type: **calgeo.app**
2. Click **Add**
3. Vercel will ask "Add domain calgeo.app?" - Click **Add**

### 2.3 Get DNS Records
Vercel will show you DNS records to add. It will look something like:

```
Type: A
Name: @
Value: 76.76.21.21
```

**Keep this tab open** - you'll need these values for GoDaddy.

---

## Step 3: Configure DNS in GoDaddy

### 3.1 Open GoDaddy DNS Management
1. Go to: https://account.godaddy.com/products
2. Find **calgeo.app** in your domains list
3. Click the three dots (...) next to calgeo.app
4. Click **Manage DNS**

### 3.2 Add A Record
1. Scroll to **DNS Records** section
2. Click **Add New Record** button
3. Select type: **A**
4. Fill in:
   - **Name:** @ (this means root domain)
   - **Value:** `76.76.21.21` (use the exact value Vercel shows)
   - **TTL:** 1 Hour (or 600 seconds)
5. Click **Save**

### 3.3 Add www Subdomain (Optional but Recommended)
To make **www.calgeo.app** also work:

1. Click **Add New Record** again
2. Select type: **CNAME**
3. Fill in:
   - **Name:** www
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** 1 Hour
4. Click **Save**

---

## Step 4: Wait for DNS Propagation

### How Long?
- **Minimum:** 5 minutes
- **Average:** 10-15 minutes
- **Maximum:** 48 hours (rare)

### Check Status in Vercel
1. Go back to Vercel → Settings → Domains
2. Refresh the page every few minutes
3. When DNS is ready, you'll see:
   - ✅ **Valid Configuration** (green checkmark)
   - SSL certificate will be automatically generated

### Optional: Check DNS Propagation
Visit: https://dnschecker.org/
- Enter: **calgeo.app**
- Type: **A**
- Click **Search**
- Look for green checkmarks showing **76.76.21.21**

---

## Step 5: Set Primary Domain (Optional)

After DNS is configured, you can make calgeo.app your primary domain:

1. In Vercel → Settings → Domains
2. Find **calgeo.app** in the list
3. Click the three dots (...) next to it
4. Click **Set as Primary Domain**

This ensures:
- All redirects use calgeo.app
- Vercel URLs redirect to calgeo.app

---

## Step 6: Redeploy

After DNS is configured and Vercel shows "Valid Configuration":

1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"..."** → **Redeploy**
4. Wait 2-3 minutes

---

## Step 7: Test Your Live App

### Visit Your Domain
Go to: **https://calgeo.app**

### Test Checklist
- [ ] App loads without errors
- [ ] HTTPS (SSL) is working (padlock in browser)
- [ ] Gold calculator works
- [ ] Silver calculator works
- [ ] Jade calculator works
- [ ] Spot prices refresh (shows "Source: goldapi.io")
- [ ] Google Maps loads with jewelry stores
- [ ] Search works (zipcode, city, name)
- [ ] Login/Sign up works
- [ ] Upgrade buttons work (Pro/Expert tiers)

---

## Troubleshooting

### DNS Not Propagating After 30 Minutes?

**Check GoDaddy:**
1. Go to GoDaddy DNS settings
2. Verify A record shows:
   - Name: @
   - Value: 76.76.21.21 (or Vercel's IP)
   - Status: Active

**Check for Conflicting Records:**
- Delete any existing A records pointing to other IPs
- Delete any CNAME records for @ (root domain)

### Vercel Shows "Invalid Configuration"?

**Common Causes:**
1. Wrong IP address in A record
2. DNS hasn't propagated yet (wait longer)
3. Typo in domain name

**Fix:**
- Double-check the IP in GoDaddy matches Vercel exactly
- Wait another 10-15 minutes
- Clear your browser cache

### SSL Certificate Not Working?

Vercel automatically provisions SSL certificates via Let's Encrypt. This happens after DNS is valid.

**If you see "Not Secure" warning:**
1. Wait 5-10 more minutes
2. In Vercel → Domains, click "Renew Certificate"
3. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Domain Shows "This site can't be reached"?

**Cause:** DNS hasn't propagated yet

**Fix:**
1. Use https://dnschecker.org/ to verify DNS
2. Wait longer (up to 48 hours in rare cases)
3. Try from different device/network

---

## Quick Reference

### Your URLs After Setup
- **Primary:** https://calgeo.app
- **With www:** https://www.calgeo.app (if you added CNAME)
- **Vercel URL:** https://calgeo-i9kgqisq0-marketsavages-projects.vercel.app (still works)

### GoDaddy DNS Settings
```
Type: A
Name: @
Value: 76.76.21.21 (use Vercel's IP)
TTL: 1 Hour

Type: CNAME (optional)
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

### Important Links
- **Vercel Domains:** https://vercel.com/marketsavages-projects/calgeo/settings/domains
- **GoDaddy DNS:** https://account.godaddy.com/products
- **DNS Checker:** https://dnschecker.org/
- **Your App:** https://calgeo.app

---

## Next Steps After Domain Setup

### 1. Update Stripe Webhook (Important!)
If you're using Stripe webhooks, update the endpoint URL:
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click your webhook endpoint
3. Update URL to: `https://calgeo.app/api/webhooks/stripe`
4. Save changes

### 2. Update Google Maps API Restrictions (Recommended)
For security, restrict your Google Maps API key to your domain:
1. Go to: https://console.cloud.google.com/google/maps-apis/credentials
2. Click your API key
3. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `calgeo.app/*`
   - Add: `*.calgeo.app/*`
4. Save

### 3. Update Supabase Redirect URLs (If Using OAuth)
If you enable social login (Google, GitHub, etc.):
1. Go to: https://supabase.com/dashboard/project/bhololjzmdvasykcwugg/auth/url-configuration
2. Add `https://calgeo.app` to allowed redirect URLs

---

**Last Updated:** January 5, 2025
**Status:** Ready to deploy 🚀
