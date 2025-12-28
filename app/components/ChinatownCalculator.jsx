'use client';

import React, { useState, useMemo } from 'react';

export default function ChinatownJewelryCalculator() {
  const [activeTab, setActiveTab] = useState('gold');
  
  // ========== GOLD STATE ==========
  const [spotPrice24k, setSpotPrice24k] = useState(144.46);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [includeTax, setIncludeTax] = useState(true);
  const [taxRate, setTaxRate] = useState(8.875);

  // Chain state
  const [chainKarat, setChainKarat] = useState('24');
  const [chainStyle, setChainStyle] = useState('cuban');
  const [chainMetal, setChainMetal] = useState('solid');
  const [chainWeight, setChainWeight] = useState('');
  const [chainPrice, setChainPrice] = useState('');

  // Charm toggle + state
  const [includeCharm, setIncludeCharm] = useState(false);
  const [charmKarat, setCharmKarat] = useState('24');
  const [charmStyle, setCharmStyle] = useState('simple');
  const [charmMetal, setCharmMetal] = useState('solid');
  const [charmWeight, setCharmWeight] = useState('');
  const [charmPrice, setCharmPrice] = useState('');

  // ========== JADE STATE ==========
  const [jadeType, setJadeType] = useState('jadeite');
  const [jadeGrade, setJadeGrade] = useState('A');
  const [jadeColor, setJadeColor] = useState('apple_green');
  const [jadeTranslucency, setJadeTranslucency] = useState('semi');
  const [jadeItem, setJadeItem] = useState('bangle');
  const [jadeSize, setJadeSize] = useState('medium');
  const [jadePrice, setJadePrice] = useState('');

  // ========== CONFIG ==========
  const karatOptions = [
    { value: '24', label: '24K (99.9%)', purity: 0.999 },
    { value: '22', label: '22K (91.6%)', purity: 0.916 },
    { value: '18', label: '18K (75%)', purity: 0.750 },
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
    { value: 'solid', label: 'Solid (Yellow)', mult: 1.0 },
    { value: 'rhodium', label: 'Rhodium Plated', mult: 1.05 },
    { value: 'rose', label: 'Rose Gold', mult: 1.08 },
    { value: 'white', label: 'White Gold', mult: 1.10 },
    { value: 'two_tone', label: 'Two-Tone', mult: 1.15 },
    { value: 'tri_color', label: 'Tri-Color', mult: 1.25 }
  ];

  // Jade config
  const jadeTypes = [
    { value: 'jadeite', label: 'Jadeite (Valuable)', mult: 1 },
    { value: 'nephrite', label: 'Nephrite (Common)', mult: 0.15 }
  ];

  const jadeGrades = [
    { value: 'A', label: 'Type A (Natural)', mult: 1, warning: null },
    { value: 'B', label: 'Type B (Bleached)', mult: 0.1, warning: 'Resin-filled, degrades' },
    { value: 'C', label: 'Type C (Dyed)', mult: 0.05, warning: 'Color will fade' },
    { value: 'BC', label: 'Type B+C', mult: 0.03, warning: 'Heavily treated' }
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
    { value: 'transparent', label: 'Transparent (Glass)', mult: 3 },
    { value: 'semi', label: 'Semi-Transparent (Ice)', mult: 2 },
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

  // ========== HELPERS ==========
  const getKaratPurity = (k) => karatOptions.find(o => o.value === k)?.purity || 0.999;
  const getChainMarkup = (s) => chainStyles.find(o => o.value === s)?.markup || 35;
  const getCharmMarkup = (s) => charmStyles.find(o => o.value === s)?.markup || 25;
  const getMetalMult = (m) => metalCombos.find(o => o.value === m)?.mult || 1;

  const refreshSpotPrice = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('https://api.gold-api.com/price/XAU');
      const data = await res.json();
      setSpotPrice24k(data.price / 31.1035);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to fetch');
    }
    setIsRefreshing(false);
  };

  // ========== GOLD CALCULATIONS ==========
  const goldCalc = useMemo(() => {
    const cWeight = parseFloat(chainWeight) || 0;
    const cPrice = parseFloat(chainPrice) || 0;
    const chWeight = parseFloat(charmWeight) || 0;
    const chPrice = parseFloat(charmPrice) || 0;

    // Chain calculations
    const chainSpot = spotPrice24k * getKaratPurity(chainKarat);
    const chainMelt = cWeight * chainSpot;
    const chainBaseMarkup = getChainMarkup(chainStyle);
    const chainMetalMult = getMetalMult(chainMetal);
    const chainExpectedMarkup = chainBaseMarkup * chainMetalMult;

    let chainPreTax = cPrice;
    let chainTax = 0;
    if (includeTax && cPrice > 0) {
      chainPreTax = cPrice / (1 + taxRate / 100);
      chainTax = cPrice - chainPreTax;
    }
    const chainPremium = chainPreTax - chainMelt;
    const chainPremiumPct = chainMelt > 0 ? (chainPremium / chainMelt) * 100 : 0;

    // Charm calculations
    let charmMelt = 0, charmPreTax = 0, charmTax = 0, charmPremium = 0, charmPremiumPct = 0, charmExpectedMarkup = 0;
    if (includeCharm) {
      const charmSpot = spotPrice24k * getKaratPurity(charmKarat);
      charmMelt = chWeight * charmSpot;
      const charmBaseMarkup = getCharmMarkup(charmStyle);
      const charmMetalMult = getMetalMult(charmMetal);
      charmExpectedMarkup = charmBaseMarkup * charmMetalMult;

      charmPreTax = chPrice;
      if (includeTax && chPrice > 0) {
        charmPreTax = chPrice / (1 + taxRate / 100);
        charmTax = chPrice - charmPreTax;
      }
      charmPremium = charmPreTax - charmMelt;
      charmPremiumPct = charmMelt > 0 ? (charmPremium / charmMelt) * 100 : 0;
    }

    // Combined totals
    const totalMelt = chainMelt + charmMelt;
    const totalPreTax = chainPreTax + charmPreTax;
    const totalPremium = chainPremium + charmPremium;
    const totalPremiumPct = totalMelt > 0 ? (totalPremium / totalMelt) * 100 : 0;

    // Weighted expected markup
    const weightedExpected = totalMelt > 0 
      ? ((chainMelt * chainExpectedMarkup) + (charmMelt * charmExpectedMarkup)) / totalMelt
      : chainExpectedMarkup;

    // Negotiation targets
    const minMarkup = weightedExpected * 0.85;
    const maxMarkup = weightedExpected * 1.15;
    const targetAggressive = totalMelt * (1 + minMarkup / 100);
    const targetFair = totalMelt * (1 + weightedExpected / 100);
    const targetMax = totalMelt * (1 + maxMarkup / 100);

    return {
      chain: { melt: chainMelt, preTax: chainPreTax, tax: chainTax, premium: chainPremium, pct: chainPremiumPct, expected: chainExpectedMarkup },
      charm: { melt: charmMelt, preTax: charmPreTax, tax: charmTax, premium: charmPremium, pct: charmPremiumPct, expected: charmExpectedMarkup },
      total: { melt: totalMelt, preTax: totalPreTax, premium: totalPremium, pct: totalPremiumPct, expected: weightedExpected },
      targets: { aggressive: targetAggressive, fair: targetFair, max: targetMax, minPct: minMarkup, maxPct: maxMarkup }
    };
  }, [chainWeight, chainPrice, chainKarat, chainStyle, chainMetal, charmWeight, charmPrice, charmKarat, charmStyle, charmMetal, includeCharm, includeTax, taxRate, spotPrice24k]);

  const getGrade = (actual, expected) => {
    const diff = actual - expected;
    if (diff <= -10) return { grade: 'STEAL', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', emoji: '🔥' };
    if (diff <= 5) return { grade: 'GOOD', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', emoji: '✓' };
    if (diff <= 15) return { grade: 'FAIR', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', emoji: '⚖️' };
    if (diff <= 25) return { grade: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', emoji: '⚠️' };
    return { grade: 'OVERPRICED', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', emoji: '🚫' };
  };

  // ========== JADE CALCULATIONS ==========
  const jadeCalc = useMemo(() => {
    const ask = parseFloat(jadePrice) || 0;
    const item = jadeItems.find(i => i.value === jadeItem);
    const base = item?.base || 500;
    const sizeMult = item?.sizes[jadeSize] || 1;
    const typeMult = jadeTypes.find(t => t.value === jadeType)?.mult || 1;
    const gradeMult = jadeGrades.find(g => g.value === jadeGrade)?.mult || 1;
    const colorMult = jadeColors.find(c => c.value === jadeColor)?.mult || 1;
    const transMult = jadeTranslucencies.find(t => t.value === jadeTranslucency)?.mult || 1;

    const expected = base * sizeMult * typeMult * gradeMult * colorMult * transMult;
    let preTax = ask;
    if (includeTax && ask > 0) preTax = ask / (1 + taxRate / 100);
    const ratio = expected > 0 ? preTax / expected : 0;

    const redFlags = [];
    if (jadeGrade !== 'A' && preTax > 200) redFlags.push('High price for treated jade');
    if (jadeColor === 'imperial_green' && preTax < 1000 && jadeGrade === 'A') redFlags.push('Imperial green too cheap - likely fake');

    return { expected, low: expected * 0.6, high: expected * 1.5, preTax, ratio, redFlags };
  }, [jadeType, jadeGrade, jadeColor, jadeTranslucency, jadeItem, jadeSize, jadePrice, includeTax, taxRate]);

  const getJadeGrade = (ratio) => {
    if (ratio <= 0.5) return { grade: 'STEAL', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', emoji: '🔥' };
    if (ratio <= 0.8) return { grade: 'GOOD', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', emoji: '✓' };
    if (ratio <= 1.2) return { grade: 'FAIR', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', emoji: '⚖️' };
    if (ratio <= 1.8) return { grade: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', emoji: '⚠️' };
    return { grade: 'OVERPRICED', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', emoji: '🚫' };
  };

  const totalGrade = getGrade(goldCalc.total.pct, goldCalc.total.expected);
  const jadeGradeResult = getJadeGrade(jadeCalc.ratio);
  const hasChainInput = parseFloat(chainWeight) > 0 && parseFloat(chainPrice) > 0;
  const hasCharmInput = parseFloat(charmWeight) > 0 && parseFloat(charmPrice) > 0;
  const showResults = hasChainInput || (includeCharm && hasCharmInput);

  const selectClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none";
  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none";
  const labelClass = "block text-xs text-gray-500 uppercase mb-1";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-amber-400">Chinatown Calculator</h1>
          <p className="text-xs text-gray-500">Gold & Jade Evaluator</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('gold')} className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${activeTab === 'gold' ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
            🥇 Gold
          </button>
          <button onClick={() => setActiveTab('jade')} className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${activeTab === 'jade' ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
            💚 Jade
          </button>
        </div>

        {/* ========== GOLD TAB ========== */}
        {activeTab === 'gold' && (
          <>
            {/* Spot Price */}
            <div className="bg-gray-900 rounded-xl p-3 mb-3 border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-gray-500 text-sm">24K Spot: </span>
                <span className="text-amber-400 font-mono font-bold">${spotPrice24k.toFixed(2)}/g</span>
                {lastUpdated && <span className="text-xs text-gray-600 ml-2">({lastUpdated})</span>}
              </div>
              <button onClick={refreshSpotPrice} disabled={isRefreshing} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs">
                {isRefreshing ? '...' : '🔄'}
              </button>
            </div>

            {/* Tax Toggle */}
            <div className="bg-gray-900 rounded-xl p-3 mb-3 border border-gray-800">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} className="w-4 h-4 rounded" />
                Prices include {taxRate}% tax
              </label>
            </div>

            {/* CHAIN SECTION */}
            <div className="bg-gray-900 rounded-xl p-4 mb-3 border border-gray-800">
              <div className="text-sm font-semibold text-amber-400 mb-3">⛓️ Chain</div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Karat</label>
                  <select value={chainKarat} onChange={(e) => setChainKarat(e.target.value)} className={selectClass}>
                    {karatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Style</label>
                  <select value={chainStyle} onChange={(e) => setChainStyle(e.target.value)} className={selectClass}>
                    {chainStyles.map(o => <option key={o.value} value={o.value}>{o.label} ({o.markup}%)</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Metal</label>
                  <select value={chainMetal} onChange={(e) => setChainMetal(e.target.value)} className={selectClass}>
                    {metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Weight (g)</label>
                  <input type="number" value={chainWeight} onChange={(e) => setChainWeight(e.target.value)} placeholder="0.00" className={inputClass} step="0.01" />
                </div>
                <div>
                  <label className={labelClass}>Price ($)</label>
                  <input type="number" value={chainPrice} onChange={(e) => setChainPrice(e.target.value)} placeholder="0.00" className={inputClass} step="0.01" />
                </div>
              </div>
            </div>

            {/* ADD CHARM TOGGLE */}
            <div className="bg-gray-900 rounded-xl p-3 mb-3 border border-gray-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeCharm} onChange={(e) => setIncludeCharm(e.target.checked)} className="w-5 h-5 rounded accent-amber-500" />
                <span className="text-sm font-medium text-gray-300">➕ Add Charm to Calculation</span>
              </label>
            </div>

            {/* CHARM SECTION */}
            {includeCharm && (
              <div className="bg-gray-900 rounded-xl p-4 mb-3 border border-amber-500/30">
                <div className="text-sm font-semibold text-amber-400 mb-3">🏅 Charm</div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelClass}>Karat</label>
                    <select value={charmKarat} onChange={(e) => setCharmKarat(e.target.value)} className={selectClass}>
                      {karatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Style</label>
                    <select value={charmStyle} onChange={(e) => setCharmStyle(e.target.value)} className={selectClass}>
                      {charmStyles.map(o => <option key={o.value} value={o.value}>{o.label} ({o.markup}%)</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Metal</label>
                    <select value={charmMetal} onChange={(e) => setCharmMetal(e.target.value)} className={selectClass}>
                      {metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Weight (g)</label>
                    <input type="number" value={charmWeight} onChange={(e) => setCharmWeight(e.target.value)} placeholder="0.00" className={inputClass} step="0.01" />
                  </div>
                  <div>
                    <label className={labelClass}>Price ($)</label>
                    <input type="number" value={charmPrice} onChange={(e) => setCharmPrice(e.target.value)} placeholder="0.00" className={inputClass} step="0.01" />
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS */}
            {showResults && (
              <div className={`rounded-xl p-4 mb-3 border ${totalGrade.border} ${totalGrade.bg}`}>
                
                {/* Verdict */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-1">{totalGrade.emoji}</div>
                  <div className={`text-2xl font-bold ${totalGrade.color}`}>{totalGrade.grade}</div>
                  <div className={`text-3xl font-mono font-bold ${totalGrade.color}`}>{goldCalc.total.pct.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">vs expected ~{goldCalc.total.expected.toFixed(0)}%</div>
                </div>

                {/* Breakdown */}
                <div className="bg-gray-900/50 rounded-lg p-3 mb-4 text-sm space-y-2">
                  {hasChainInput && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chain melt:</span>
                      <span className="font-mono text-emerald-400">${goldCalc.chain.melt.toFixed(2)}</span>
                    </div>
                  )}
                  {includeCharm && hasCharmInput && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Charm melt:</span>
                      <span className="font-mono text-emerald-400">${goldCalc.charm.melt.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-700 pt-2">
                    <span className="text-gray-400 font-medium">Total melt value:</span>
                    <span className="font-mono font-bold text-emerald-400">${goldCalc.total.melt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Total asking:</span>
                    <span className="font-mono font-bold">${goldCalc.total.preTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Premium:</span>
                    <span className={`font-mono font-bold ${goldCalc.total.premium > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                      ${goldCalc.total.premium.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Negotiation Targets */}
                <div className="border-t border-gray-700/50 pt-3">
                  <div className="text-xs text-gray-500 uppercase mb-2 text-center font-medium">💬 Negotiation Targets</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                      <div>
                        <span className="text-green-400 font-medium">🔥 Aggressive</span>
                        <span className="text-xs text-gray-500 ml-2">({goldCalc.targets.minPct.toFixed(0)}%)</span>
                      </div>
                      <span className="font-mono text-xl font-bold text-green-400">${goldCalc.targets.aggressive.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <div>
                        <span className="text-emerald-400 font-medium">✓ Fair</span>
                        <span className="text-xs text-gray-500 ml-2">({goldCalc.total.expected.toFixed(0)}%)</span>
                      </div>
                      <span className="font-mono text-xl font-bold text-emerald-400">${goldCalc.targets.fair.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <div>
                        <span className="text-yellow-400 font-medium">⚖️ Max</span>
                        <span className="text-xs text-gray-500 ml-2">({goldCalc.targets.maxPct.toFixed(0)}%)</span>
                      </div>
                      <span className="font-mono text-xl font-bold text-yellow-400">${goldCalc.targets.max.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== JADE TAB ========== */}
        {activeTab === 'jade' && (
          <>
            <div className="bg-gray-900 rounded-xl p-4 mb-3 border border-gray-800">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Stone Type</label>
                  <select value={jadeType} onChange={(e) => setJadeType(e.target.value)} className={selectClass}>
                    {jadeTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Grade</label>
                  <select value={jadeGrade} onChange={(e) => setJadeGrade(e.target.value)} className={selectClass}>
                    {jadeGrades.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Color</label>
                  <select value={jadeColor} onChange={(e) => setJadeColor(e.target.value)} className={selectClass}>
                    {jadeColors.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Translucency</label>
                  <select value={jadeTranslucency} onChange={(e) => setJadeTranslucency(e.target.value)} className={selectClass}>
                    {jadeTranslucencies.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClass}>Item</label>
                  <select value={jadeItem} onChange={(e) => setJadeItem(e.target.value)} className={selectClass}>
                    {jadeItems.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Size</label>
                  <select value={jadeSize} onChange={(e) => setJadeSize(e.target.value)} className={selectClass}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Asking Price ($)</label>
                <input type="number" value={jadePrice} onChange={(e) => setJadePrice(e.target.value)} placeholder="0.00" className={inputClass} step="0.01" />
              </div>
            </div>

            {/* Jade Results */}
            {parseFloat(jadePrice) > 0 && (
              <div className={`rounded-xl p-4 mb-3 border ${jadeGradeResult.border} ${jadeGradeResult.bg}`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-1">{jadeGradeResult.emoji}</div>
                  <div className={`text-2xl font-bold ${jadeGradeResult.color}`}>{jadeGradeResult.grade}</div>
                  <div className={`text-xl font-mono ${jadeGradeResult.color}`}>{(jadeCalc.ratio * 100).toFixed(0)}% of expected</div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 mb-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected value:</span>
                    <span className="font-mono text-emerald-400">${jadeCalc.expected.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market range:</span>
                    <span className="font-mono">${jadeCalc.low.toFixed(0)} - ${jadeCalc.high.toFixed(0)}</span>
                  </div>
                </div>

                {jadeCalc.redFlags.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                    {jadeCalc.redFlags.map((f, i) => <div key={i} className="text-xs text-red-400">⚠️ {f}</div>)}
                  </div>
                )}

                {/* Jade Negotiation */}
                <div className="border-t border-gray-700/50 pt-3">
                  <div className="text-xs text-gray-500 uppercase mb-2 text-center">💬 Counter-Offers</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                      <span className="text-green-400 font-medium">🔥 Aggressive (50%)</span>
                      <span className="font-mono text-xl font-bold text-green-400">${(jadeCalc.expected * 0.5).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <span className="text-emerald-400 font-medium">✓ Target (80%)</span>
                      <span className="font-mono text-xl font-bold text-emerald-400">${(jadeCalc.expected * 0.8).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <span className="text-yellow-400 font-medium">⚖️ Max (100%)</span>
                      <span className="font-mono text-xl font-bold text-yellow-400">${jadeCalc.expected.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="text-center text-xs text-gray-600 mt-4">Hangar One Aviation LLC • Dec 2025</div>
      </div>
    </div>
  );
}
