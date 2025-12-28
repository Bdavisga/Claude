# CalGeo - Updates & Changelog

**Last Updated:** December 28, 2025

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
