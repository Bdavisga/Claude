# CalGeo - Professional Jewelry Valuation App

**A Marketsavage Product**

CalGeo is a professional jewelry valuation application for calculating fair market values for gold chains, charms, and jade jewelry. Features AI-powered image analysis, live gold spot prices, and an interactive map to find nearby jewelry shops.

## Features

- 🥇 **Gold Calculator** - Calculate melt value and markup for gold chains and charms
- 💚 **Jade Valuation** - Evaluate jade pieces based on type, grade, color, and translucency
- 📸 **AI Image Scanning** - Analyze jewelry photos with AI (tiered access)
- 🗺️ **Map Integration** - Find nearby gold and jade dealers with Google Maps
- 🛒 **Price Comparison** - Compare quotes from multiple shops
- 📜 **Transaction History** - Track and review past valuations
- 📖 **Glossary** - Comprehensive jewelry terminology reference
- 💎 **Tier System** - Free, Pro, and Expert subscription levels

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Maps API (Required for Map Feature)

The Map tab requires a Google Maps API key with the Places API enabled.

1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API**
3. Open `app/components/CalGeo.jsx`
4. Find line 298 and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```javascript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places`;
```

**Note:** Without an API key, the map will show a loading message but won't function.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view CalGeo in your browser.

## Project Structure

```
/app
  /components
    CalGeo.jsx          # Main application component
  page.js               # Home page
  globals.css           # Global styles
```

## How to Use

### Gold Calculator
1. Select chain karat, style, metal type
2. Enter weight (grams) and asking price
3. Optionally add a charm with its own specifications
4. View melt value, markup percentage, and negotiation targets

### Jade Calculator
1. Select jade type, grade, color, translucency
2. Choose item type and size
3. Enter asking price
4. Review expected value range and red flags

### AI Image Scanning (Tier-Limited)
1. Upload a photo of jewelry
2. Choose Auto or Guided analysis mode
3. AI detects gold/jade type and specifications
4. Auto-fills calculator forms based on detection

### Map Feature
1. Navigate to Map tab
2. Grant location permission (or use default NYC location)
3. Search for specific terms like "gold dealers" or "jade shops"
4. Click markers to view shop details
5. Default search: 5km radius for jewelry stores

### Price Comparison
1. Add quotes from multiple shops
2. Compare prices side-by-side
3. View best deal highlighted
4. Search for businesses with autocomplete

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** JavaScript (not TypeScript)
- **Styling:** Inline styles with CSS-in-JS
- **Map:** Google Maps JavaScript API
- **AI:** Gemini AI (via API routes)
- **Storage:** localStorage for persistence

## Legal

© 2025 Marketsavage. All rights reserved.

**Disclaimer:** CalGeo provides jewelry valuation estimates for informational purposes only. All calculations, AI analyses, and price recommendations are approximations. Users assume full responsibility for verifying authenticity and negotiating prices. Always consult certified appraisers for definitive valuations.

## Version

**CalGeo v1.2 - Production Ready**

---

Built with [Next.js](https://nextjs.org) - Powered by Gemini AI
