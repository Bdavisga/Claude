'use client';

import React, { useState, useMemo, useRef } from 'react';

// ============================================================
// CALGEO v1.1 - Calculator Geology
// Professional Jewelry Valuation App
// ============================================================

export default function CalGeo() {
  // App State
  const [activeTab, setActiveTab] = useState('gold');
  const [userTier, setUserTier] = useState('free');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const MAX_FREE_ANALYSES = 3;

  // Spot Price State
  const [spotPriceKarat, setSpotPriceKarat] = useState('24');
  const [spotPrice24k, setSpotPrice24k] = useState(84.50);
  const [displayedSpotPrice, setDisplayedSpotPrice] = useState(84.50);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tax State - by State
  const [selectedState, setSelectedState] = useState('NY');
  const [includeTax, setIncludeTax] = useState(true);

  // Image Analysis State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('auto');
  const fileInputRef = useRef(null);

  // Chain State
  const [chainKarat, setChainKarat] = useState('24');
  const [chainStyle, setChainStyle] = useState('cuban');
  const [chainMetal, setChainMetal] = useState('solid');
  const [chainWeight, setChainWeight] = useState('');
  const [chainPrice, setChainPrice] = useState('');

  // Charm State
  const [includeCharm, setIncludeCharm] = useState(false);
  const [charmKarat, setCharmKarat] = useState('24');
  const [charmStyle, setCharmStyle] = useState('simple');
  const [charmMetal, setCharmMetal] = useState('solid');
  const [charmWeight, setCharmWeight] = useState('');
  const [charmPrice, setCharmPrice] = useState('');

  // Jade State
  const [jadeType, setJadeType] = useState('jadeite');
  const [jadeGrade, setJadeGrade] = useState('A');
  const [jadeColor, setJadeColor] = useState('apple_green');
  const [jadeTranslucency, setJadeTranslucency] = useState('semi');
  const [jadeItem, setJadeItem] = useState('pendant_small');
  const [jadeSize, setJadeSize] = useState('medium');
  const [jadePrice, setJadePrice] = useState('');

  // History State
  const [history, setHistory] = useState([]);

  // Shopping List State
  const [shoppingList, setShoppingList] = useState([]);
  const [showAddShop, setShowAddShop] = useState(false);
  const [newShop, setNewShop] = useState({ name: '', address: '', item: '', price: '', notes: '', rating: '', placeId: '' });
  const [placeSearch, setPlaceSearch] = useState('');
  const [placeResults, setPlaceResults] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

  // ============================================================
  // STATE SALES TAX DATA (Average combined state + local)
  // ============================================================
  const stateTaxRates = {
    'AL': { name: 'Alabama', rate: 9.24 },
    'AK': { name: 'Alaska', rate: 1.76 },
    'AZ': { name: 'Arizona', rate: 8.40 },
    'AR': { name: 'Arkansas', rate: 9.47 },
    'CA': { name: 'California', rate: 8.68 },
    'CO': { name: 'Colorado', rate: 7.77 },
    'CT': { name: 'Connecticut', rate: 6.35 },
    'DE': { name: 'Delaware', rate: 0.00 },
    'FL': { name: 'Florida', rate: 7.02 },
    'GA': { name: 'Georgia', rate: 7.35 },
    'HI': { name: 'Hawaii', rate: 4.44 },
    'ID': { name: 'Idaho', rate: 6.02 },
    'IL': { name: 'Illinois', rate: 8.81 },
    'IN': { name: 'Indiana', rate: 7.00 },
    'IA': { name: 'Iowa', rate: 6.94 },
    'KS': { name: 'Kansas', rate: 8.70 },
    'KY': { name: 'Kentucky', rate: 6.00 },
    'LA': { name: 'Louisiana', rate: 9.55 },
    'ME': { name: 'Maine', rate: 5.50 },
    'MD': { name: 'Maryland', rate: 6.00 },
    'MA': { name: 'Massachusetts', rate: 6.25 },
    'MI': { name: 'Michigan', rate: 6.00 },
    'MN': { name: 'Minnesota', rate: 7.49 },
    'MS': { name: 'Mississippi', rate: 7.07 },
    'MO': { name: 'Missouri', rate: 8.29 },
    'MT': { name: 'Montana', rate: 0.00 },
    'NE': { name: 'Nebraska', rate: 6.94 },
    'NV': { name: 'Nevada', rate: 8.23 },
    'NH': { name: 'New Hampshire', rate: 0.00 },
    'NJ': { name: 'New Jersey', rate: 6.63 },
    'NM': { name: 'New Mexico', rate: 7.72 },
    'NY': { name: 'New York', rate: 8.52 },
    'NC': { name: 'North Carolina', rate: 6.98 },
    'ND': { name: 'North Dakota', rate: 6.96 },
    'OH': { name: 'Ohio', rate: 7.24 },
    'OK': { name: 'Oklahoma', rate: 8.98 },
    'OR': { name: 'Oregon', rate: 0.00 },
    'PA': { name: 'Pennsylvania', rate: 6.34 },
    'RI': { name: 'Rhode Island', rate: 7.00 },
    'SC': { name: 'South Carolina', rate: 7.44 },
    'SD': { name: 'South Dakota', rate: 6.40 },
    'TN': { name: 'Tennessee', rate: 9.55 },
    'TX': { name: 'Texas', rate: 8.20 },
    'UT': { name: 'Utah', rate: 7.19 },
    'VT': { name: 'Vermont', rate: 6.24 },
    'VA': { name: 'Virginia', rate: 5.75 },
    'WA': { name: 'Washington', rate: 9.29 },
    'WV': { name: 'West Virginia', rate: 6.55 },
    'WI': { name: 'Wisconsin', rate: 5.43 },
    'WY': { name: 'Wyoming', rate: 5.36 },
    'DC': { name: 'Washington DC', rate: 6.00 }
  };

  const taxRate = stateTaxRates[selectedState]?.rate || 8.52;

  // ============================================================
  // CONFIGURATION DATA
  // ============================================================
  const karatOptions = [
    { value: '24', label: '24K (99.9%)', purity: 0.999 },
    { value: '22', label: '22K (91.6%)', purity: 0.916 },
    { value: '18', label: '18K (75.0%)', purity: 0.750 },
    { value: '14', label: '14K (58.3%)', purity: 0.583 },
    { value: '10', label: '10K (41.7%)', purity: 0.417 }
  ];

  const chainStyles = [
    { value: 'plain', label: 'Plain/Cable', markup: 20 },
    { value: 'box', label: 'Box', markup: 22 },
    { value: 'snake', label: 'Snake', markup: 25 },
    { value: 'singapore', label: 'Singapore', markup: 28 },
    { value: 'curb', label: 'Curb', markup: 28 },
    { value: 'rope', label: 'Rope', markup: 30 },
    { value: 'figaro', label: 'Figaro', markup: 30 },
    { value: 'mariner', label: 'Mariner', markup: 32 },
    { value: 'cuban', label: 'Cuban', markup: 35 },
    { value: 'wheat', label: 'Wheat', markup: 35 },
    { value: 'herringbone', label: 'Herringbone', markup: 38 },
    { value: 'franco', label: 'Franco', markup: 40 },
    { value: 'foxtail', label: 'Foxtail', markup: 42 },
    { value: 'miami_cuban', label: 'Miami Cuban', markup: 45 },
    { value: 'byzantine', label: 'Byzantine', markup: 50 },
    { value: 'hollow', label: 'Hollow', markup: 20 }
  ];

  const charmStyles = [
    { value: 'hollow', label: 'Hollow', markup: 20 },
    { value: 'simple', label: 'Simple/Flat', markup: 25 },
    { value: 'coin', label: 'Coin/Medallion', markup: 30 },
    { value: 'heart', label: 'Heart', markup: 32 },
    { value: '3d', label: '3D/Puffed', markup: 35 },
    { value: 'religious', label: 'Religious', markup: 35 },
    { value: 'zodiac', label: 'Zodiac', markup: 35 },
    { value: 'animal', label: 'Animal', markup: 38 },
    { value: 'initial', label: 'Initial/Letter', markup: 38 },
    { value: 'detailed', label: 'Detailed/Engraved', markup: 40 },
    { value: 'diamond_cut', label: 'Diamond Cut', markup: 40 },
    { value: 'character', label: 'Character/Figure', markup: 42 },
    { value: 'iced', label: 'Iced/CZ Stones', markup: 55 },
    { value: 'custom', label: 'Custom', markup: 65 }
  ];

  const metalCombos = [
    { value: 'solid', label: 'Solid Yellow', mult: 1.0 },
    { value: 'rhodium', label: 'Rhodium Plated', mult: 1.05 },
    { value: 'rose', label: 'Rose Gold', mult: 1.08 },
    { value: 'white', label: 'White Gold', mult: 1.10 },
    { value: 'two_tone', label: 'Two-Tone', mult: 1.15 },
    { value: 'tri_color', label: 'Tri-Color', mult: 1.25 }
  ];

  const jadeTypes = [
    { value: 'jadeite', label: 'Jadeite', mult: 1 },
    { value: 'nephrite', label: 'Nephrite', mult: 0.15 }
  ];

  const jadeGrades = [
    { value: 'A', label: 'Type A (Natural)', mult: 1 },
    { value: 'B', label: 'Type B (Bleached)', mult: 0.1 },
    { value: 'C', label: 'Type C (Dyed)', mult: 0.05 },
    { value: 'BC', label: 'Type B+C', mult: 0.03 }
  ];

  const jadeColors = [
    { value: 'imperial_green', label: 'Imperial Green', mult: 10 },
    { value: 'vivid_lavender', label: 'Vivid Lavender', mult: 5 },
    { value: 'apple_green', label: 'Apple Green', mult: 2 },
    { value: 'lavender', label: 'Light Lavender', mult: 1.8 },
    { value: 'white_ice', label: 'White/Ice', mult: 1.5 },
    { value: 'multicolor', label: 'Multi-color', mult: 1.2 },
    { value: 'light_green', label: 'Light Green', mult: 1 },
    { value: 'yellow', label: 'Yellow/Honey', mult: 0.8 },
    { value: 'red', label: 'Red/Russet', mult: 0.7 },
    { value: 'black', label: 'Black', mult: 0.5 }
  ];

  const jadeTranslucencies = [
    { value: 'transparent', label: 'Transparent', mult: 3 },
    { value: 'semi', label: 'Semi-Transparent', mult: 2 },
    { value: 'translucent', label: 'Translucent', mult: 1.2 },
    { value: 'waxy', label: 'Waxy/Cloudy', mult: 0.7 },
    { value: 'opaque', label: 'Opaque', mult: 0.3 }
  ];

  const jadeItems = [
    { value: 'bangle', label: 'Bangle', base: 800, sizes: { small: 0.7, medium: 1, large: 1.4 } },
    { value: 'pendant_large', label: 'Pendant (Large)', base: 600, sizes: { small: 0.7, medium: 1, large: 1.5 } },
    { value: 'pendant_small', label: 'Pendant (Small)', base: 300, sizes: { small: 0.6, medium: 1, large: 1.5 } },
    { value: 'saddle_ring', label: 'Saddle Ring', base: 700, sizes: { small: 0.7, medium: 1, large: 1.4 } },
    { value: 'beads', label: 'Bead Necklace', base: 500, sizes: { small: 0.5, medium: 1, large: 2 } },
    { value: 'cabochon_ring', label: 'Cabochon Ring', base: 400, sizes: { small: 0.6, medium: 1, large: 1.5 } },
    { value: 'carving', label: 'Carving/Figurine', base: 400, sizes: { small: 0.5, medium: 1, large: 2.5 } },
    { value: 'earrings', label: 'Earrings (pair)', base: 350, sizes: { small: 0.6, medium: 1, large: 1.4 } }
  ];

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const getKaratPurity = (k) => karatOptions.find(o => o.value === k)?.purity || 0.999;
  const getChainMarkup = (s) => chainStyles.find(o => o.value === s)?.markup || 35;
  const getCharmMarkup = (s) => charmStyles.find(o => o.value === s)?.markup || 25;
  const getMetalMult = (m) => metalCombos.find(o => o.value === m)?.mult || 1;

  // Calculate spot price for selected karat
  const getSpotForKarat = (karat) => {
    const purity = getKaratPurity(karat);
    return spotPrice24k * purity;
  };

  const canAnalyze = () => {
    if (userTier === 'expert') return true;
    if (userTier === 'pro') return analysisCount < 50;
    return analysisCount < MAX_FREE_ANALYSES;
  };

  // ============================================================
  // SPOT PRICE REFRESH - Real-time API
  // ============================================================
  const refreshSpotPrice = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://api.gold-api.com/price/XAU');
      const data = await res.json();
      const pricePerOz = data.price;
      const pricePerGram24k = pricePerOz / 31.1035;
      setSpotPrice24k(pricePerGram24k);
      
      // Calculate for selected karat
      const purity = getKaratPurity(spotPriceKarat);
      setDisplayedSpotPrice(pricePerGram24k * purity);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to fetch spot price:', e);
      // Fallback calculation with existing price
      const purity = getKaratPurity(spotPriceKarat);
      setDisplayedSpotPrice(spotPrice24k * purity);
    }
    setIsRefreshing(false);
  };

  // Update displayed price when karat changes
  const handleSpotKaratChange = (karat) => {
    setSpotPriceKarat(karat);
    const purity = getKaratPurity(karat);
    setDisplayedSpotPrice(spotPrice24k * purity);
  };

  // ============================================================
  // GOOGLE PLACES SEARCH (Mock - Replace with actual API)
  // ============================================================
  const searchPlaces = async (query) => {
    if (!query || query.length < 2) {
      setPlaceResults([]);
      return;
    }
    setIsSearchingPlaces(true);
    
    // In production, call your backend which calls Google Places API
    // Example: const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
    
    // Mock results for demo
    await new Promise(r => setTimeout(r, 500));
    const mockResults = [
      { placeId: '1', name: 'AAA Jade Fine Jewelry', address: '37B Elizabeth St, New York, NY 10013', rating: 4.5, reviews: 128 },
      { placeId: '2', name: 'Golden Palace Jewelry', address: '88 Mott St, New York, NY 10013', rating: 4.2, reviews: 89 },
      { placeId: '3', name: 'Lucky Dragon Gold', address: '142 Canal St, New York, NY 10002', rating: 4.7, reviews: 256 },
      { placeId: '4', name: 'Chinatown Gold Exchange', address: '55 Bowery, New York, NY 10002', rating: 4.0, reviews: 67 },
    ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase()));
    
    setPlaceResults(mockResults);
    setIsSearchingPlaces(false);
  };

  const selectPlace = (place) => {
    setNewShop({
      ...newShop,
      name: place.name,
      address: place.address,
      rating: place.rating,
      placeId: place.placeId
    });
    setPlaceSearch(place.name);
    setPlaceResults([]);
  };

  // ============================================================
  // HISTORY FUNCTIONS
  // ============================================================
  const addToHistory = (entry) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ...entry
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 100));
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // ============================================================
  // SHOPPING LIST FUNCTIONS
  // ============================================================
  const addToShoppingList = () => {
    if (!newShop.name || !newShop.item || !newShop.price) return;
    
    const item = {
      id: Date.now(),
      ...newShop,
      price: parseFloat(newShop.price),
      addedAt: new Date().toLocaleString()
    };
    
    setShoppingList(prev => [...prev, item]);
    setNewShop({ name: '', address: '', item: '', price: '', notes: '', rating: '', placeId: '' });
    setPlaceSearch('');
    setShowAddShop(false);
  };

  const removeFromList = (id) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const getBestDeal = () => {
    if (shoppingList.length === 0) return null;
    return shoppingList.reduce((min, item) => item.price < min.price ? item : min);
  };

  // ============================================================
  // IMAGE ANALYSIS
  // ============================================================
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!canAnalyze()) {
      setShowUpgrade(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisCount(prev => prev + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedResult = {
        type: 'gold',
        confidence: 0.92,
        detected: {
          itemType: 'chain',
          estimatedKarat: '24',
          style: 'cuban',
          metalColor: 'solid',
          hasCharm: false
        },
        warnings: ['Weight must be verified on scale'],
        notes: 'Appears to be genuine gold based on color and luster'
      };

      setAnalysisResult(simulatedResult);
      addToHistory({ type: 'scan', result: simulatedResult });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  // ============================================================
  // CALCULATIONS
  // ============================================================
  const goldCalc = useMemo(() => {
    const cWeight = parseFloat(chainWeight) || 0;
    const cPrice = parseFloat(chainPrice) || 0;
    const chWeight = parseFloat(charmWeight) || 0;
    const chPrice = parseFloat(charmPrice) || 0;

    const chainSpot = spotPrice24k * getKaratPurity(chainKarat);
    const chainMelt = cWeight * chainSpot;
    const chainBaseMarkup = getChainMarkup(chainStyle);
    const chainMetalMult = getMetalMult(chainMetal);
    const chainExpectedMarkup = chainBaseMarkup * chainMetalMult;

    let chainPreTax = cPrice;
    if (includeTax && cPrice > 0) chainPreTax = cPrice / (1 + taxRate / 100);

    let charmMelt = 0, charmPreTax = 0, charmExpectedMarkup = 0;
    if (includeCharm) {
      const charmSpot = spotPrice24k * getKaratPurity(charmKarat);
      charmMelt = chWeight * charmSpot;
      charmExpectedMarkup = getCharmMarkup(charmStyle) * getMetalMult(charmMetal);
      charmPreTax = chPrice;
      if (includeTax && chPrice > 0) charmPreTax = chPrice / (1 + taxRate / 100);
    }

    const totalMelt = chainMelt + charmMelt;
    const totalPreTax = chainPreTax + charmPreTax;
    const totalPremium = totalPreTax - totalMelt;
    const totalPremiumPct = totalMelt > 0 ? (totalPremium / totalMelt) * 100 : 0;

    const weightedExpected = totalMelt > 0 
      ? ((chainMelt * chainExpectedMarkup) + (charmMelt * charmExpectedMarkup)) / totalMelt
      : chainExpectedMarkup;

    const minMarkup = weightedExpected * 0.85;
    const maxMarkup = weightedExpected * 1.15;

    return {
      chain: { melt: chainMelt, expected: chainExpectedMarkup },
      charm: { melt: charmMelt, expected: charmExpectedMarkup },
      total: { melt: totalMelt, preTax: totalPreTax, premium: totalPremium, pct: totalPremiumPct, expected: weightedExpected },
      targets: { 
        aggressive: totalMelt * (1 + minMarkup / 100), 
        fair: totalMelt * (1 + weightedExpected / 100), 
        max: totalMelt * (1 + maxMarkup / 100),
        minPct: minMarkup,
        maxPct: maxMarkup
      }
    };
  }, [chainWeight, chainPrice, chainKarat, chainStyle, chainMetal, charmWeight, charmPrice, charmKarat, charmStyle, charmMetal, includeCharm, includeTax, taxRate, spotPrice24k]);

  const jadeCalc = useMemo(() => {
    const ask = parseFloat(jadePrice) || 0;
    const item = jadeItems.find(i => i.value === jadeItem);
    const base = item?.base || 500;
    const sizeMult = item?.sizes[jadeSize] || 1;
    const expected = base * sizeMult * 
      (jadeTypes.find(t => t.value === jadeType)?.mult || 1) *
      (jadeGrades.find(g => g.value === jadeGrade)?.mult || 1) *
      (jadeColors.find(c => c.value === jadeColor)?.mult || 1) *
      (jadeTranslucencies.find(t => t.value === jadeTranslucency)?.mult || 1);

    let preTax = ask;
    if (includeTax && ask > 0) preTax = ask / (1 + taxRate / 100);
    const ratio = expected > 0 ? preTax / expected : 0;

    const redFlags = [];
    if (jadeGrade !== 'A' && preTax > 200) redFlags.push('High price for treated jade');
    if (jadeColor === 'imperial_green' && preTax < 1000 && jadeGrade === 'A') redFlags.push('Imperial green too cheap - verify authenticity');

    return { expected, low: expected * 0.6, high: expected * 1.5, preTax, ratio, redFlags };
  }, [jadeType, jadeGrade, jadeColor, jadeTranslucency, jadeItem, jadeSize, jadePrice, includeTax, taxRate]);

  const getGrade = (actual, expected) => {
    const diff = actual - expected;
    if (diff <= -10) return { grade: 'STEAL', color: '#22c55e', emoji: '🔥' };
    if (diff <= 5) return { grade: 'GOOD', color: '#10b981', emoji: '✓' };
    if (diff <= 15) return { grade: 'FAIR', color: '#eab308', emoji: '⚖️' };
    if (diff <= 25) return { grade: 'HIGH', color: '#f97316', emoji: '⚠️' };
    return { grade: 'OVERPRICED', color: '#ef4444', emoji: '🚫' };
  };

  const getJadeGrade = (ratio) => {
    if (ratio <= 0.5) return { grade: 'STEAL', color: '#22c55e', emoji: '🔥' };
    if (ratio <= 0.8) return { grade: 'GOOD', color: '#10b981', emoji: '✓' };
    if (ratio <= 1.2) return { grade: 'FAIR', color: '#eab308', emoji: '⚖️' };
    if (ratio <= 1.8) return { grade: 'HIGH', color: '#f97316', emoji: '⚠️' };
    return { grade: 'OVERPRICED', color: '#ef4444', emoji: '🚫' };
  };

  const totalGrade = getGrade(goldCalc.total.pct, goldCalc.total.expected);
  const jadeGradeResult = getJadeGrade(jadeCalc.ratio);
  const hasGoldInput = (parseFloat(chainWeight) > 0 && parseFloat(chainPrice) > 0) || (includeCharm && parseFloat(charmWeight) > 0 && parseFloat(charmPrice) > 0);
  const bestDeal = getBestDeal();

  // ============================================================
  // STYLES
  // ============================================================
  const s = {
    container: { minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0f 0%, #111118 100%)', color: '#e5e5e5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    header: { background: 'linear-gradient(90deg, #141420 0%, #1a1a2e 100%)', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 },
    logo: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoIcon: { width: '34px', height: '34px', background: 'linear-gradient(135deg, #d4af37 0%, #b8960c 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 2px 8px rgba(212,175,55,0.3)' },
    logoText: { fontSize: '22px', fontWeight: '700', background: 'linear-gradient(90deg, #d4af37 0%, #f4d03f 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    tierBadge: { padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none', cursor: 'pointer' },
    main: { maxWidth: '500px', margin: '0 auto', padding: '12px 16px' },
    tabs: { display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' },
    tab: (active, color) => ({ padding: '10px 14px', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', background: active ? color : 'rgba(255,255,255,0.05)', color: active ? '#000' : '#666', whiteSpace: 'nowrap' }),
    card: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', marginBottom: '12px' },
    cardHeader: { fontSize: '13px', fontWeight: '600', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
    label: { display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', marginBottom: '6px' },
    select: { width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none' },
    input: { width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
    resultCard: (color) => ({ background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`, border: `1px solid ${color}50`, borderRadius: '16px', padding: '18px', marginBottom: '12px' }),
    verdict: { textAlign: 'center', marginBottom: '18px' },
    verdictEmoji: { fontSize: '44px', marginBottom: '8px' },
    verdictGrade: (color) => ({ fontSize: '26px', fontWeight: '700', color, marginBottom: '4px' }),
    verdictPct: (color) => ({ fontSize: '34px', fontWeight: '700', fontFamily: 'monospace', color }),
    breakdown: { background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '16px' },
    breakdownRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' },
    targetCard: (color) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${color}18`, border: `1px solid ${color}40`, borderRadius: '10px', padding: '12px 16px', marginBottom: '8px' }),
    targetPrice: (color) => ({ fontSize: '22px', fontWeight: '700', fontFamily: 'monospace', color }),
    btn: { padding: '12px 18px', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
    btnPrimary: { background: 'linear-gradient(90deg, #d4af37 0%, #b8960c 100%)', color: '#000' },
    btnSecondary: { background: 'rgba(255,255,255,0.08)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' },
    btnDanger: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    spotCard: { background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={s.container}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcon}>💎</div>
          <span style={s.logoText}>CalGeo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: '#555' }}>
            {userTier === 'free' && `${MAX_FREE_ANALYSES - analysisCount} scans`}
          </span>
          <button 
            onClick={() => setShowUpgrade(true)} 
            style={{ ...s.tierBadge, background: userTier === 'expert' ? 'linear-gradient(90deg, #d4af37, #f4d03f)' : userTier === 'pro' ? '#3b82f6' : '#374151', color: userTier === 'free' ? '#888' : '#000' }}
          >
            {userTier}
          </button>
        </div>
      </header>

      <main style={s.main}>
        {/* Tabs */}
        <div style={s.tabs}>
          <button onClick={() => setActiveTab('gold')} style={s.tab(activeTab === 'gold', '#d4af37')}>🥇 Gold</button>
          <button onClick={() => setActiveTab('jade')} style={s.tab(activeTab === 'jade', '#10b981')}>💚 Jade</button>
          <button onClick={() => setActiveTab('scan')} style={s.tab(activeTab === 'scan', '#8b5cf6')}>📸 Scan</button>
          <button onClick={() => setActiveTab('list')} style={s.tab(activeTab === 'list', '#f59e0b')}>🛒 Compare</button>
          <button onClick={() => setActiveTab('history')} style={s.tab(activeTab === 'history', '#6366f1')}>📜 History</button>
        </div>

        {/* ==================== GOLD TAB ==================== */}
        {activeTab === 'gold' && (
          <>
            {/* SPOT PRICE CARD */}
            <div style={s.spotCard}>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Live Spot Price</span>
                {lastUpdated && <span style={{ color: '#666' }}>Updated: {lastUpdated}</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: '0 0 110px' }}>
                  <select 
                    value={spotPriceKarat} 
                    onChange={(e) => handleSpotKaratChange(e.target.value)} 
                    style={s.select}
                  >
                    {karatOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ color: '#d4af37', fontFamily: 'monospace', fontWeight: '700', fontSize: '28px' }}>
                    ${displayedSpotPrice.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>per gram</div>
                </div>
                <button 
                  onClick={refreshSpotPrice}
                  disabled={isRefreshing}
                  style={{ ...s.btn, ...s.btnPrimary, padding: '12px 16px' }}
                >
                  {isRefreshing ? '⏳' : '🔄'}
                </button>
              </div>
            </div>

            {/* STATE TAX SELECTOR */}
            <div style={s.card}>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>State</label>
                  <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} style={s.select}>
                    {Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, data]) => (
                      <option key={code} value={code}>{data.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Sales Tax Rate</label>
                  <div style={{ padding: '10px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '16px', color: '#d4af37' }}>
                    {taxRate.toFixed(2)}%
                  </div>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '12px', color: '#888', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} />
                Prices include sales tax
              </label>
            </div>

            {/* Chain Section */}
            <div style={s.card}>
              <div style={{ ...s.cardHeader, color: '#d4af37' }}><span>⛓️</span> Chain</div>
              <div style={{ ...s.grid2, marginBottom: '12px' }}>
                <div>
                  <label style={s.label}>Karat</label>
                  <select value={chainKarat} onChange={(e) => setChainKarat(e.target.value)} style={s.select}>
                    {karatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Style</label>
                  <select value={chainStyle} onChange={(e) => setChainStyle(e.target.value)} style={s.select}>
                    {chainStyles.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={s.grid3}>
                <div>
                  <label style={s.label}>Metal</label>
                  <select value={chainMetal} onChange={(e) => setChainMetal(e.target.value)} style={s.select}>
                    {metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Weight (g)</label>
                  <input type="number" value={chainWeight} onChange={(e) => setChainWeight(e.target.value)} placeholder="0.00" style={s.input} step="0.01" />
                </div>
                <div>
                  <label style={s.label}>Price ($)</label>
                  <input type="number" value={chainPrice} onChange={(e) => setChainPrice(e.target.value)} placeholder="0.00" style={s.input} step="0.01" />
                </div>
              </div>
            </div>

            {/* Add Charm */}
            <div style={s.card}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', color: '#d4af37' }}>
                <input type="checkbox" checked={includeCharm} onChange={(e) => setIncludeCharm(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                ➕ Add Charm to Calculation
              </label>
            </div>

            {includeCharm && (
              <div style={{ ...s.card, border: '1px solid rgba(212,175,55,0.3)' }}>
                <div style={{ ...s.cardHeader, color: '#d4af37' }}><span>🏅</span> Charm</div>
                <div style={{ ...s.grid2, marginBottom: '12px' }}>
                  <div>
                    <label style={s.label}>Karat</label>
                    <select value={charmKarat} onChange={(e) => setCharmKarat(e.target.value)} style={s.select}>
                      {karatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Style</label>
                    <select value={charmStyle} onChange={(e) => setCharmStyle(e.target.value)} style={s.select}>
                      {charmStyles.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.grid3}>
                  <div>
                    <label style={s.label}>Metal</label>
                    <select value={charmMetal} onChange={(e) => setCharmMetal(e.target.value)} style={s.select}>
                      {metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Weight (g)</label>
                    <input type="number" value={charmWeight} onChange={(e) => setCharmWeight(e.target.value)} placeholder="0.00" style={s.input} step="0.01" />
                  </div>
                  <div>
                    <label style={s.label}>Price ($)</label>
                    <input type="number" value={charmPrice} onChange={(e) => setCharmPrice(e.target.value)} placeholder="0.00" style={s.input} step="0.01" />
                  </div>
                </div>
              </div>
            )}

            {/* Gold Results */}
            {hasGoldInput && (
              <div style={s.resultCard(totalGrade.color)}>
                <div style={s.verdict}>
                  <div style={s.verdictEmoji}>{totalGrade.emoji}</div>
                  <div style={s.verdictGrade(totalGrade.color)}>{totalGrade.grade}</div>
                  <div style={s.verdictPct(totalGrade.color)}>{goldCalc.total.pct.toFixed(1)}%</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>markup vs expected ~{goldCalc.total.expected.toFixed(0)}%</div>
                </div>

                <div style={s.breakdown}>
                  <div style={s.breakdownRow}>
                    <span style={{ color: '#888' }}>Melt Value</span>
                    <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: '600' }}>${goldCalc.total.melt.toFixed(2)}</span>
                  </div>
                  <div style={s.breakdownRow}>
                    <span style={{ color: '#888' }}>Asking (pre-tax)</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>${goldCalc.total.preTax.toFixed(2)}</span>
                  </div>
                  <div style={{ ...s.breakdownRow, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ color: '#888' }}>Premium</span>
                    <span style={{ color: goldCalc.total.premium > 0 ? '#f97316' : '#10b981', fontFamily: 'monospace', fontWeight: '600' }}>
                      {goldCalc.total.premium >= 0 ? '+' : ''}${goldCalc.total.premium.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px' }}>💬 Negotiation Targets</div>
                <div style={s.targetCard('#22c55e')}>
                  <span style={{ fontSize: '13px' }}>🔥 Aggressive ({goldCalc.targets.minPct.toFixed(0)}%)</span>
                  <span style={s.targetPrice('#22c55e')}>${goldCalc.targets.aggressive.toFixed(0)}</span>
                </div>
                <div style={s.targetCard('#10b981')}>
                  <span style={{ fontSize: '13px' }}>✓ Fair ({goldCalc.total.expected.toFixed(0)}%)</span>
                  <span style={s.targetPrice('#10b981')}>${goldCalc.targets.fair.toFixed(0)}</span>
                </div>
                <div style={s.targetCard('#eab308')}>
                  <span style={{ fontSize: '13px' }}>⚖️ Max ({goldCalc.targets.maxPct.toFixed(0)}%)</span>
                  <span style={s.targetPrice('#eab308')}>${goldCalc.targets.max.toFixed(0)}</span>
                </div>

                <button 
                  onClick={() => addToHistory({ type: 'gold', grade: totalGrade.grade, pct: goldCalc.total.pct.toFixed(1), melt: goldCalc.total.melt.toFixed(2), price: goldCalc.total.preTax.toFixed(2), karat: chainKarat, style: chainStyle })}
                  style={{ ...s.btn, ...s.btnSecondary, width: '100%', marginTop: '12px' }}
                >
                  📜 Save to History
                </button>
              </div>
            )}
          </>
        )}

        {/* ==================== JADE TAB ==================== */}
        {activeTab === 'jade' && (
          <>
            {/* State Tax */}
            <div style={s.card}>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>State</label>
                  <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} style={s.select}>
                    {Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, data]) => (
                      <option key={code} value={code}>{data.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Sales Tax</label>
                  <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', fontFamily: 'monospace', color: '#10b981' }}>{taxRate.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ ...s.grid2, marginBottom: '12px' }}>
                <div>
                  <label style={s.label}>Stone Type</label>
                  <select value={jadeType} onChange={(e) => setJadeType(e.target.value)} style={s.select}>
                    {jadeTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Grade</label>
                  <select value={jadeGrade} onChange={(e) => setJadeGrade(e.target.value)} style={s.select}>
                    {jadeGrades.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ ...s.grid2, marginBottom: '12px' }}>
                <div>
                  <label style={s.label}>Color</label>
                  <select value={jadeColor} onChange={(e) => setJadeColor(e.target.value)} style={s.select}>
                    {jadeColors.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Translucency</label>
                  <select value={jadeTranslucency} onChange={(e) => setJadeTranslucency(e.target.value)} style={s.select}>
                    {jadeTranslucencies.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ ...s.grid2, marginBottom: '12px' }}>
                <div>
                  <label style={s.label}>Item Type</label>
                  <select value={jadeItem} onChange={(e) => setJadeItem(e.target.value)} style={s.select}>
                    {jadeItems.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Size</label>
                  <select value={jadeSize} onChange={(e) => setJadeSize(e.target.value)} style={s.select}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={s.label}>Asking Price ($)</label>
                <input type="number" value={jadePrice} onChange={(e) => setJadePrice(e.target.value)} placeholder="0.00" style={s.input} step="0.01" />
              </div>
            </div>

            {parseFloat(jadePrice) > 0 && (
              <div style={s.resultCard(jadeGradeResult.color)}>
                <div style={s.verdict}>
                  <div style={s.verdictEmoji}>{jadeGradeResult.emoji}</div>
                  <div style={s.verdictGrade(jadeGradeResult.color)}>{jadeGradeResult.grade}</div>
                  <div style={s.verdictPct(jadeGradeResult.color)}>{(jadeCalc.ratio * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>of expected value</div>
                </div>

                <div style={s.breakdown}>
                  <div style={s.breakdownRow}>
                    <span style={{ color: '#888' }}>Expected Value</span>
                    <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: '600' }}>${jadeCalc.expected.toFixed(0)}</span>
                  </div>
                  <div style={s.breakdownRow}>
                    <span style={{ color: '#888' }}>Market Range</span>
                    <span style={{ fontFamily: 'monospace' }}>${jadeCalc.low.toFixed(0)} - ${jadeCalc.high.toFixed(0)}</span>
                  </div>
                </div>

                {jadeCalc.redFlags.length > 0 && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                    {jadeCalc.redFlags.map((f, i) => <div key={i} style={{ fontSize: '12px', color: '#ef4444' }}>⚠️ {f}</div>)}
                  </div>
                )}

                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px' }}>💬 Counter-Offers</div>
                <div style={s.targetCard('#22c55e')}>
                  <span style={{ fontSize: '13px' }}>🔥 Aggressive (50%)</span>
                  <span style={s.targetPrice('#22c55e')}>${(jadeCalc.expected * 0.5).toFixed(0)}</span>
                </div>
                <div style={s.targetCard('#10b981')}>
                  <span style={{ fontSize: '13px' }}>✓ Target (80%)</span>
                  <span style={s.targetPrice('#10b981')}>${(jadeCalc.expected * 0.8).toFixed(0)}</span>
                </div>
                <div style={s.targetCard('#eab308')}>
                  <span style={{ fontSize: '13px' }}>⚖️ Max (100%)</span>
                  <span style={s.targetPrice('#eab308')}>${jadeCalc.expected.toFixed(0)}</span>
                </div>

                <button 
                  onClick={() => addToHistory({ type: 'jade', grade: jadeGradeResult.grade, ratio: (jadeCalc.ratio * 100).toFixed(0), expected: jadeCalc.expected.toFixed(0), price: jadeCalc.preTax.toFixed(2), color: jadeColor, jadeGrade })}
                  style={{ ...s.btn, ...s.btnSecondary, width: '100%', marginTop: '12px' }}
                >
                  📜 Save to History
                </button>
              </div>
            )}
          </>
        )}

        {/* ==================== SCAN TAB ==================== */}
        {activeTab === 'scan' && (
          <>
            <div style={s.card}>
              <div style={{ ...s.cardHeader, color: '#8b5cf6' }}><span>📸</span> AI Image Analysis</div>
              
              <div style={{ ...s.grid2, marginBottom: '14px' }}>
                <button onClick={() => setAnalysisMode('auto')} style={{ ...s.btn, background: analysisMode === 'auto' ? 'rgba(139,92,246,0.2)' : 'transparent', border: `1px solid ${analysisMode === 'auto' ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, color: analysisMode === 'auto' ? '#8b5cf6' : '#666' }}>🤖 Auto Detect</button>
                <button onClick={() => setAnalysisMode('guided')} style={{ ...s.btn, background: analysisMode === 'guided' ? 'rgba(139,92,246,0.2)' : 'transparent', border: `1px solid ${analysisMode === 'guided' ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, color: analysisMode === 'guided' ? '#8b5cf6' : '#666' }}>👆 Guided</button>
              </div>

              <input type="file" accept="image/*" onChange={handleImageSelect} ref={fileInputRef} style={{ display: 'none' }} />
              
              {!imagePreview ? (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed rgba(139,92,246,0.3)', borderRadius: '14px', padding: '40px', textAlign: 'center', cursor: 'pointer', background: 'rgba(139,92,246,0.05)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
                  <div style={{ color: '#8b5cf6', fontWeight: '500' }}>Tap to upload photo</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>JPG, PNG up to 10MB</div>
                </div>
              ) : (
                <div>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
                  <div style={s.grid2}>
                    <button onClick={() => { setImagePreview(null); setSelectedImage(null); setAnalysisResult(null); }} style={{ ...s.btn, ...s.btnDanger }}>Clear</button>
                    <button onClick={analyzeImage} disabled={isAnalyzing} style={{ ...s.btn, ...s.btnPrimary }}>{isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze'}</button>
                  </div>
                </div>
              )}
            </div>

            {analysisResult && (
              <div style={s.resultCard('#8b5cf6')}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#888' }}>CONFIDENCE</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6' }}>{(analysisResult.confidence * 100).toFixed(0)}%</div>
                </div>
                <div style={s.breakdown}>
                  {Object.entries(analysisResult.detected).map(([k, v]) => (
                    <div key={k} style={s.breakdownRow}>
                      <span style={{ color: '#888', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span style={{ color: '#fff' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab(analysisResult.type)} style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>Apply & Calculate →</button>
              </div>
            )}
          </>
        )}

        {/* ==================== SHOPPING LIST TAB ==================== */}
        {activeTab === 'list' && (
          <>
            <div style={s.card}>
              <div style={{ ...s.cardHeader, color: '#f59e0b' }}><span>🛒</span> Price Comparison</div>
              
              {!showAddShop ? (
                <button onClick={() => setShowAddShop(true)} style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>➕ Add Shop Quote</button>
              ) : (
                <>
                  {/* Google Places Search */}
                  <div style={{ marginBottom: '12px', position: 'relative' }}>
                    <label style={s.label}>Search Business</label>
                    <input 
                      type="text" 
                      value={placeSearch} 
                      onChange={(e) => { setPlaceSearch(e.target.value); searchPlaces(e.target.value); }}
                      placeholder="Search jewelry shops..." 
                      style={s.input} 
                    />
                    {placeResults.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '4px', zIndex: 10, maxHeight: '200px', overflow: 'auto' }}>
                        {placeResults.map((place) => (
                          <div key={place.placeId} onClick={() => selectPlace(place)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontWeight: '500', marginBottom: '2px' }}>{place.name}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{place.address}</div>
                            <div style={{ fontSize: '11px', color: '#f59e0b' }}>⭐ {place.rating} ({place.reviews} reviews)</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ ...s.grid2, marginBottom: '12px' }}>
                    <div>
                      <label style={s.label}>Shop Name</label>
                      <input type="text" value={newShop.name} onChange={(e) => setNewShop({...newShop, name: e.target.value})} placeholder="Shop name" style={s.input} />
                    </div>
                    <div>
                      <label style={s.label}>Address</label>
                      <input type="text" value={newShop.address} onChange={(e) => setNewShop({...newShop, address: e.target.value})} placeholder="Address" style={s.input} />
                    </div>
                  </div>

                  <div style={{ ...s.grid2, marginBottom: '12px' }}>
                    <div>
                      <label style={s.label}>Item Description</label>
                      <input type="text" value={newShop.item} onChange={(e) => setNewShop({...newShop, item: e.target.value})} placeholder="24K Cuban 10g" style={s.input} />
                    </div>
                    <div>
                      <label style={s.label}>Quoted Price ($)</label>
                      <input type="number" value={newShop.price} onChange={(e) => setNewShop({...newShop, price: e.target.value})} placeholder="0.00" style={s.input} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={s.label}>Notes (optional)</label>
                    <input type="text" value={newShop.notes} onChange={(e) => setNewShop({...newShop, notes: e.target.value})} placeholder="Additional notes..." style={s.input} />
                  </div>

                  <div style={s.grid2}>
                    <button onClick={() => { setShowAddShop(false); setNewShop({ name: '', address: '', item: '', price: '', notes: '', rating: '', placeId: '' }); setPlaceSearch(''); }} style={{ ...s.btn, ...s.btnSecondary }}>Cancel</button>
                    <button onClick={addToShoppingList} style={{ ...s.btn, ...s.btnPrimary }}>Add to List</button>
                  </div>
                </>
              )}
            </div>

            {/* Best Deal Banner */}
            {bestDeal && shoppingList.length > 1 && (
              <div style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>🏆 BEST DEAL</div>
                  <div style={{ fontWeight: '600' }}>{bestDeal.name}</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e', fontFamily: 'monospace' }}>${bestDeal.price.toFixed(0)}</div>
              </div>
            )}

            {/* Shopping List Items */}
            {shoppingList.length > 0 ? (
              shoppingList.sort((a, b) => a.price - b.price).map((item, idx) => (
                <div key={item.id} style={{ ...s.card, border: item.id === bestDeal?.id ? '1px solid rgba(34,197,94,0.4)' : undefined, background: item.id === bestDeal?.id ? 'rgba(34,197,94,0.08)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {idx === 0 && shoppingList.length > 1 && <span style={{ color: '#22c55e' }}>🏆</span>}
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>{item.address}</div>
                      {item.rating && <div style={{ fontSize: '11px', color: '#f59e0b' }}>⭐ {item.rating}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'monospace', color: idx === 0 ? '#22c55e' : '#d4af37' }}>${item.price.toFixed(0)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{item.item}</div>
                  {item.notes && <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{item.notes}</div>}
                  <button onClick={() => removeFromList(item.id)} style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}>🗑️ Remove</button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛒</div>
                <div>No quotes yet</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Add shop quotes to compare prices</div>
              </div>
            )}
          </>
        )}

        {/* ==================== HISTORY TAB ==================== */}
        {activeTab === 'history' && (
          <>
            {history.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>{history.length} entries</span>
                <button onClick={clearHistory} style={{ ...s.btn, ...s.btnDanger, padding: '8px 14px', fontSize: '11px' }}>🗑️ Clear All</button>
              </div>
            )}

            {history.length > 0 ? (
              history.map((entry) => (
                <div key={entry.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#555' }}>{entry.timestamp}</span>
                    <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '20px', background: entry.type === 'gold' ? 'rgba(212,175,55,0.2)' : entry.type === 'jade' ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)', color: entry.type === 'gold' ? '#d4af37' : entry.type === 'jade' ? '#10b981' : '#8b5cf6', fontWeight: '600' }}>
                      {entry.type.toUpperCase()}
                    </span>
                  </div>
                  {entry.grade && (
                    <div style={{ fontSize: '18px', fontWeight: '700', color: entry.grade === 'STEAL' || entry.grade === 'GOOD' ? '#22c55e' : entry.grade === 'FAIR' ? '#eab308' : '#ef4444', marginBottom: '6px' }}>
                      {entry.grade}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {entry.pct && <div>Markup: {entry.pct}%</div>}
                    {entry.ratio && <div>Ratio: {entry.ratio}%</div>}
                    {entry.melt && <div>Melt: ${entry.melt}</div>}
                    {entry.price && <div>Price: ${entry.price}</div>}
                    {entry.karat && <div>Karat: {entry.karat}K • {entry.style}</div>}
                  </div>
                  <button onClick={() => deleteHistoryItem(entry.id)} style={{ fontSize: '10px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', marginTop: '6px' }}>🗑️ Delete</button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📜</div>
                <div>No history yet</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Save calculations to track them here</div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px', color: '#333', fontSize: '10px' }}>
          CalGeo v1.1 • Powered by Gemini AI
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setShowUpgrade(false)}>
          <div style={{ background: '#15151f', borderRadius: '20px', padding: '24px', maxWidth: '360px', width: '100%', border: '1px solid rgba(212,175,55,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>💎</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#d4af37' }}>Upgrade CalGeo</div>
            </div>

            {[
              { tier: 'free', name: 'Free', price: '$0', features: '3 AI scans • Basic calculator', color: '#666' },
              { tier: 'pro', name: 'Pro', price: '$4.99/mo', features: '50 scans • History • Export', color: '#3b82f6' },
              { tier: 'expert', name: 'Expert', price: '$9.99/mo', features: 'Unlimited • AI insights • Priority', color: '#d4af37' }
            ].map((plan) => (
              <div key={plan.tier} onClick={() => setUserTier(plan.tier)} style={{ background: userTier === plan.tier ? `${plan.color}20` : 'rgba(255,255,255,0.03)', border: userTier === plan.tier ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', marginBottom: '10px', cursor: 'pointer' }}>
                <div style={{ fontWeight: '600', color: plan.color }}>{plan.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{plan.features}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: plan.color, marginTop: '8px' }}>{plan.price}</div>
              </div>
            ))}

            <button onClick={() => setShowUpgrade(false)} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: '12px' }}>
              {userTier === 'free' ? 'Continue Free' : 'Select Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
