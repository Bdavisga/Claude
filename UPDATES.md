# CalGeo - Updates & Changelog

**Last Updated:** January 17, 2026 - 8:30 PM EST

---

## 📝 January 17, 2026 - Blog Section & AdSense Integration

### **Blog Section Added**
- **Blog Listing Page** (`/blog`): Grid of articles with sidebar
- **Individual Post Pages** (`/blog/[slug]`): Full articles with SEO metadata
- **3 Starter Posts**:
  - "How to Tell If Gold Is Real: 7 Simple Tests"
  - "Understanding Gold Karat: 10K vs 14K vs 18K vs 24K"
  - "What Is My Gold Jewelry Worth? A Complete Guide"

### **AdSense Integration**
- **Ad Slot Component**: Reusable component for all ad placements
- **Ad Placements**:
  - Header leaderboard (728x90)
  - Sidebar rectangle (300x250)
  - In-content responsive ads
  - Footer leaderboard (728x90)
- **Publisher ID**: Configured with ca-pub-1897097068256252

### **SEO Features**
- Dynamic metadata per post (title, description, Open Graph)
- JSON-LD structured data for articles
- Keyword optimization for organic traffic
- Share buttons (Twitter, Facebook, LinkedIn, Copy link)

**Files Created:**
- `app/blog/layout.js` - Blog layout with AdSense script
- `app/blog/page.js` - Blog listing page
- `app/blog/[slug]/page.js` - Individual post pages
- `app/blog/components/AdSlot.jsx` - AdSense component
- `app/blog/components/BlogCard.jsx` - Post preview card
- `app/blog/components/BlogPost.jsx` - Full post display
- `app/blog/components/BlogHeader.jsx` - Blog navigation
- `app/blog/blog.css` - Blog-specific styles
- `lib/blog-posts.js` - Blog content/data

**URLs:**
- Blog listing: https://calgeo.vercel.app/blog
- Example post: https://calgeo.vercel.app/blog/how-to-tell-if-gold-is-real

---

## 📱 January 17, 2026 - PWA Setup & UI Improvements

### **Progressive Web App (PWA) for iOS**
- **Service Worker** (`/sw.js`): Network-first caching with offline fallback
- **Offline Page** (`/offline.html`): Branded offline experience when no internet
- **iOS Splash Screens**: 10 sizes generated for all iPhone models (SE to 15 Pro Max)
- **Apple Meta Tags**: Full iOS PWA support with status bar styling
- **Manifest.json**: Updated with proper icons, scope, and PWA metadata
- **iOS Safe Area Fix**: Header/sidebar now respect `env(safe-area-inset-top)` to avoid overlap with iPhone status bar in fullscreen mode

**How to Install on iPhone:**
1. Open calgeo.vercel.app in Safari
2. Tap Share → "Add to Home Screen"
3. App launches fullscreen like a native app

### **UI Improvements**
- **Sidebar Buttons**: All uniform sizing (54x44px), text-only labels
- **Diamond Button**: Now fits properly with consistent spacing
- **Tools Sub-tabs**: Removed icons, text only (History, Compare, Map)
- **Guide → Start**: Renamed navigation label
- **Theme Toggle**: Moved from Settings to sidebar bottom (🌙→☀️→💻)

### **Theme System Overhaul**
- **Light Mode CSS Variables**: Full page theming support
- **Sidebar**: Theme-aware background gradient
- **Removed**: Theme toggle from Settings modal (now in sidebar)

**Files Created:**
- `public/sw.js` - Service worker
- `public/offline.html` - Offline fallback page
- `public/splash/*.png` - 10 iOS splash screen images
- `scripts/generate-splash.js` - Splash screen generator

**Files Modified:**
- `app/components/CalGeo.jsx` - UI updates, theme toggle
- `app/layout.js` - PWA meta tags, service worker registration
- `app/styles/calgeo-design-system.css` - Light mode CSS variables
- `public/manifest.json` - Enhanced PWA manifest
- `package.json` - Added sharp for image processing

**Impact:** App now installable on iPhone as PWA with native-like experience

---

## 🔧 December 28, 2025 - Fixed Upgrade Modal Stripe Integration

### **Connected Upgrade Modal to Stripe Checkout**
- **Problem:** Upgrade modal was using mock/demo tier switching (no payment)
- **Fix:** Replaced old modal with Stripe checkout integration
- **Changes:**
  - Pro/Expert buttons now call `initiateCheckout()` function
  - Properly redirects to Stripe checkout session
  - Shows current tier in upgrade modal
  - Added console logging for debugging
- **Testing:** Click Menu → Upgrade Tier → Select Pro or Expert → Redirects to Stripe
- **Impact:** Users can now actually purchase subscriptions through Stripe

**Files Modified:** 2 (CalGeo.jsx, paywall-system.jsx)
**Lines Changed:** +58 -11

---

## ✅ December 28, 2025 - Stripe Integration Fully Configured

### **Stripe Subscription System - Ready for Testing**
- **Local environment fully configured** with test mode credentials
- **Stripe products created:**
  - CalGeo Pro: $4.99/month (recurring) - `price_1SjRXhJWNVZpdhJgLAp3u5Lw`
  - CalGeo Expert: $9.99/month (recurring) - `price_1SjRYQJWNVZpdhJgxnAhxCPT`
- **Webhook configured** for subscription events
- **API endpoints tested and working:**
  - `/api/checkout` - Creating Stripe checkout sessions ✅
  - `/api/webhooks/stripe` - Handling subscription events ✅
- **Next steps:** Add environment variables to Vercel for production deployment

**Files Configured:** `.env.local`, `VERCEL_ENV_VARS.md`
**Status:** ✅ Working locally, ready for Vercel deployment

---

## 🔧 December 28, 2025 - Critical Build Fix & Environment Setup

### **Fixed Stripe Build Error**
- **Problem:** Build failing with `"Neither apiKey nor config.authenticator provided"`
- **Root cause:** Stripe was initialized at module level without env vars during build
- **Solution:** Moved Stripe initialization inside API route functions
- **Changes:**
  - `app/api/checkout/route.js` - Initialize Stripe in POST function with env check
  - `app/api/webhooks/stripe/route.js` - Initialize Stripe in POST function with env check
- **Added safety checks:**
  - Verify `STRIPE_SECRET_KEY` exists before initialization
  - Verify `STRIPE_WEBHOOK_SECRET` exists for webhooks
  - Return proper error if Stripe not configured
- **Impact:** Build now succeeds without Stripe env vars, Stripe initializes properly at runtime

### **Environment Configuration**
- **Added `.env.example`** - Template for required environment variables
  - Includes all 6 Stripe variables with documentation
  - Links to Stripe Dashboard for setup
  - Safe to commit (no actual keys)
- **Created `.env.local`** - Local development environment (gitignored)
  - Pre-configured with test mode API keys
  - Placeholders for Price IDs and Webhook Secret
  - Dev server automatically detects and loads

**Files Modified:** 3 (2 API routes + 1 new example file)
**Files Created:** 2 (.env.example, .env.local)
**Lines Changed:** +35 -4

---

## 🎯 December 28, 2025 - Major Feature Release

### 🚀 **Stripe Paywall System Implemented**
- **Added 3-tier subscription system:**
  - **Free**: 2 AI scans (lifetime), basic features
  - **Pro**: $4.99/month, 25 scans/month, full features
  - **Expert**: $9.99/month, unlimited scans, all features
- **Created paywall infrastructure:**
  - `app/components/paywall-system.jsx` - Complete paywall UI and logic
  - `app/api/checkout/route.js` - Stripe checkout integration
  - `app/api/webhooks/stripe/route.js` - Subscription event handling
- **Added user tracking:**
  - Unique user ID generation and persistence
  - Scan count tracking with localStorage
  - Tier persistence across sessions
  - Upgrade redirect handling from Stripe
- **PaywallModal component** with:
  - Feature-specific messaging
  - Pricing cards for Pro/Expert tiers
  - Trial period badges (3-day Pro, 7-day Expert)
  - Scan counter display
- **Files created:**
  - `PAYWALL_SETUP_NEXT_STEPS.md` - Complete Stripe setup guide

**Impact:** Ready for monetization - just needs Stripe configuration

---

### ⚙️ **Settings Modal & Menu Improvements**
- **Created Settings page** accessible via hamburger menu
  - Theme toggle (Dark/Light/System) with visual selection
  - Sales tax location dropdown
  - Auto-save functionality
- **Menu reorganization:**
  - Moved Settings to bottom of Quick Actions
  - Removed redundant tax rate display block
  - Optimized menu flow: Guide → Tools → Refresh → Glossary → About → Upgrade → Settings
- **Header cleanup:**
  - Removed free tier counter from header
  - Removed theme button (moved to Settings)
  - Added username display with tier badge when logged in
  - Simplified to: Login button + Hamburger menu only

**Impact:** Cleaner UI, better user flow

---

### 🎨 **Theme System & UI Enhancements**
- **Added theme toggle** with 3 modes:
  - 🌙 Dark mode (default)
  - ☀️ Light mode
  - 💻 System (matches device preference)
- **Theme-aware color system:**
  - `getColors()` function for dynamic theming
  - Proper contrast for both light and dark modes
  - Smooth transitions between themes
- **UI consistency improvements:**
  - Uniform spacing: 16px margins/gaps across all tabs
  - Centered layout: maxWidth 600px, margin 0 auto
  - Improved card shadows and borders
  - Better visual hierarchy

**Impact:** Modern, accessible design that adapts to user preferences

---

### 📍 **iOS & Mobile Optimizations**
- **Fixed layout issues:**
  - Changed from fixed 480px to responsive 100% width
  - Added maxWidth: 600px with auto centering
  - Fixed overflow issues with proper box-sizing
  - Added viewport meta configuration
- **Spot price display fixes:**
  - Reduced font sizes to prevent overflow (26px→22px)
  - Adjusted select width (125px→110px)
  - Added flexWrap for small screens
  - Fixed button padding for mobile
- **Cross-device compatibility:**
  - Tested on iPad, iPhone, web
  - Consistent experience across all devices

**Impact:** Perfect display on all iOS devices and screen sizes

---

### 💰 **Live Gold Price API Integration**
- **Switched to goldprice.org free API:**
  - No API key required
  - Real-time LBMA prices
  - Automatic updates
- **Fixed API parsing:**
  - Corrected data extraction from `items[0].xauPrice`
  - Added silver price support (`xagPrice`)
  - Proper gram conversion (troy oz ÷ 31.1035)
- **Error handling:**
  - Fallback to frankfurter.app API
  - Final fallback to cached prices
  - User-friendly error messages
- **Display improvements:**
  - Shows data source (goldprice.org, frankfurter.app, or cached)
  - Timestamp of last update
  - Refresh button with loading state

**Impact:** Always shows current market prices, no API keys needed

---

### 🧹 **UI Cleanup & Polish**
- **Removed unnecessary elements:**
  - Clear/delete buttons from History tab
  - Remove buttons from Compare tab shopping list
  - Redundant tier counter from header
- **Improved component organization:**
  - Consolidated tab navigation
  - Cleaner card layouts
  - Better spacing hierarchy
- **Accessibility improvements:**
  - Better contrast ratios
  - Larger tap targets for mobile
  - Improved focus states

**Impact:** Cleaner, more professional appearance

---

## 📊 Statistics
- **Files Changed:** 6 new files, 20+ modified
- **Lines Added:** ~800 lines of new code
- **Features Added:** 15+ major features
- **Bug Fixes:** 8+ critical fixes
- **Performance:** Optimized for mobile, faster load times

---

## 🔜 Coming Soon
- Feature gating for Free tier (charm calculator, history, etc.)
- AI image analysis integration (Google Gemini)
- Google Places API for shop lookup
- Price drop alerts
- Batch calculation tool
- Custom markup presets

---

## 📝 Technical Details

### New Dependencies
- `stripe` v14.x - Payment processing

### API Routes Added
- `/api/checkout` - Stripe checkout session creation
- `/api/webhooks/stripe` - Subscription webhook handler
- `/api/spot-price` - Live gold/silver price updates

### State Management
- Added userId, scanCount, showPaywall, paywallFeature states
- Enhanced localStorage persistence for tier, scans, theme
- URL parameter handling for upgrade redirects

### Component Architecture
- Modular paywall system with reusable components
- Theme-aware color system
- Responsive layout utilities

---

## 🐛 Bug Fixes
1. ✅ Spot price API showing outdated $84/g → Now shows live $145+/g
2. ✅ iOS layout too wide → Responsive centered layout
3. ✅ Spot price overflow on mobile → Reduced font sizes, flexWrap
4. ✅ Settings variable error → Fixed stateTaxRates reference
5. ✅ Theme button cluttering header → Moved to Settings modal
6. ✅ goldprice.org API parsing → Corrected data extraction
7. ✅ Viewport not configured → Added proper meta tags
8. ✅ Tax display redundancy → Removed from menu

---

## 🚀 Deployment
- **Live URL:** https://calgeo.vercel.app
- **Repository:** https://github.com/Bdavisga/Claude
- **Auto-deploy:** Enabled via Vercel + GitHub integration

---

## 🙏 Credits
Built with:
- Next.js 16.1.1
- React 19
- Stripe API
- goldprice.org API
- Vercel hosting

---

**Note:** This document is automatically updated with each deployment. For setup instructions, see `PAYWALL_SETUP_NEXT_STEPS.md`.
