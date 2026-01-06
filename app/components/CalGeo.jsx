'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  TIER_CONFIG,
  PaywallModal,
  LockedOverlay,
  ScanCounter,
  hasFeature,
  canUseScan,
  getScansRemaining,
  isJadeColorLocked,
  initiateCheckout
} from './paywall-system';
import { supabase } from '../../lib/supabase';
import AuthModal from './AuthModal';
import '../styles/calgeo-design-system.css';

// ============================================================
// CALGEO v1.2 - Production Ready
// Professional Jewelry Valuation App
// ============================================================

// ==================== LOGO COMPONENT ====================
const CalGeoLogo = ({ size = 34 }) => (
  <div
    style={{
      fontSize: `${size * 0.7}px`,
      fontWeight: '800',
      background: 'linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.5px',
    }}
  >
    CalGeo
  </div>
);

export default function CalGeo() {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState('gold');
  const [userTier, setUserTier] = useState('free');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // Mobile sidebar toggle
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Track if viewport is mobile
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);
  const MAX_FREE_ANALYSES = 3;
  const [toolsSubTab, setToolsSubTab] = useState('history'); // 'history', 'compare', 'map'
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'system'

  // Paywall
  const [scanCount, setScanCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState(null);
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('calgeo_uid');
      if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('calgeo_uid', id);
      }
      return id;
    }
    return 'anon';
  });

  // First Visit Splash
  const [showSplash, setShowSplash] = useState(false);

  // Spot Price
  const [activeMetal, setActiveMetal] = useState('gold'); // 'gold' or 'silver'
  const [spotPriceKarat, setSpotPriceKarat] = useState('24');
  const [spotPrice24k, setSpotPrice24k] = useState(84.20);
  const [spotPriceSilver, setSpotPriceSilver] = useState(0.98); // per gram
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceSource, setPriceSource] = useState('');

  // Tax
  const [selectedState, setSelectedState] = useState('NY');
  const [includeTax, setIncludeTax] = useState(true);

  // Image Analysis
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('auto');
  const fileInputRef = useRef(null);

  // Gold Calculator
  const [chainKarat, setChainKarat] = useState('24');
  const [chainStyle, setChainStyle] = useState('cuban');
  const [chainMetal, setChainMetal] = useState('solid');
  const [chainWeight, setChainWeight] = useState('');
  const [chainPrice, setChainPrice] = useState('');
  const [includeCharm, setIncludeCharm] = useState(false);
  const [charmKarat, setCharmKarat] = useState('24');
  const [charmStyle, setCharmStyle] = useState('simple');
  const [charmMetal, setCharmMetal] = useState('solid');
  const [charmWeight, setCharmWeight] = useState('');
  const [charmPrice, setCharmPrice] = useState('');

  // Jade Calculator
  const [jadeType, setJadeType] = useState('jadeite');
  const [jadeGrade, setJadeGrade] = useState('A');
  const [jadeColor, setJadeColor] = useState('apple_green');
  const [jadeTranslucency, setJadeTranslucency] = useState('semi');
  const [jadeItem, setJadeItem] = useState('pendant_small');
  const [jadeSize, setJadeSize] = useState('medium');
  const [jadePrice, setJadePrice] = useState('');

  // History & Shopping
  const [history, setHistory] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [showAddShop, setShowAddShop] = useState(false);
  const [newShop, setNewShop] = useState({ name: '', address: '', item: '', price: '', notes: '', rating: '' });
  const [placeSearch, setPlaceSearch] = useState('');
  const [placeResults, setPlaceResults] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

  // Map
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Default: NYC
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapContainerRef = useRef(null);

  // ==================== EFFECTS ====================
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load from localStorage
    try {
      const h = localStorage.getItem('calgeo_history');
      const s = localStorage.getItem('calgeo_shopping');
      const t = localStorage.getItem('calgeo_tier');
      const a = localStorage.getItem('calgeo_analyses');
      const st = localStorage.getItem('calgeo_state');
      const u = localStorage.getItem('calgeo_user');
      const th = localStorage.getItem('calgeo_theme');
      if (h) setHistory(JSON.parse(h));
      if (s) setShoppingList(JSON.parse(s));
      if (t) setUserTier(t);
      if (a) setAnalysisCount(parseInt(a) || 0);
      if (st) setSelectedState(st);
      if (th) setTheme(th);
      if (u) {
        const userData = JSON.parse(u);
        setIsLoggedIn(true);
        setUsername(userData.username);
      }
    } catch (e) { console.error('Load error:', e); }

    refreshSpotPrice();
    loadGoogleMaps();
    getUserLocation();
  }, []);

  // Handle system theme detection
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Trigger re-render by updating a dummy state value
        setTheme('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Initialize map when tools tab opens to map or when map loads
  useEffect(() => {
    if (activeTab === 'tools' && toolsSubTab === 'map' && mapLoaded && mapContainerRef.current && !map) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (mapContainerRef.current) {
          initializeMap();
        }
      }, 100);
    }
  }, [activeTab, toolsSubTab, mapLoaded]);

  useEffect(() => {
    try { localStorage.setItem('calgeo_history', JSON.stringify(history)); } catch (e) {}
  }, [history]);

  useEffect(() => {
    try { localStorage.setItem('calgeo_shopping', JSON.stringify(shoppingList)); } catch (e) {}
  }, [shoppingList]);

  useEffect(() => {
    try { localStorage.setItem('calgeo_state', selectedState); } catch (e) {}
  }, [selectedState]);

  // Authentication session check and data loading
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        loadUserData(session.user.id);
      } else {
        // Fallback to localStorage for anonymous users
        const saved = localStorage.getItem('calgeo_tier');
        const scans = localStorage.getItem('calgeo_scans');
        if (saved) setUserTier(saved);
        if (scans) setScanCount(parseInt(scans));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserTier('free');
        setScanCount(0);
      }
    });

    // Check URL for successful Stripe upgrade
    const params = new URLSearchParams(window.location.search);
    const upgraded = params.get('upgraded');
    if (upgraded) {
      setUserTier(upgraded);
      localStorage.setItem('calgeo_tier', upgraded);
      window.history.replaceState({}, '', '/');
    }

    return () => subscription.unsubscribe();
  }, []);

  // Persist tier and scan count (localStorage for anonymous, Supabase for logged in)
  useEffect(() => {
    try { localStorage.setItem('calgeo_tier', userTier); } catch (e) {}
    if (user) syncUserData();
  }, [userTier]);

  useEffect(() => {
    try { localStorage.setItem('calgeo_scans', scanCount.toString()); } catch (e) {}
    if (user) syncUserData();
  }, [scanCount]);

  // First visit splash detection
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('calgeo_seen_splash');

    // Show splash if first visit
    if (!hasSeenSplash) {
      // Delay splash by 30 seconds to let users explore first
      const timer = setTimeout(() => {
        setShowSplash(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  // ==================== CONFIG DATA ====================
  const stateTaxRates = {
    'AL': { name: 'Alabama', rate: 9.24 }, 'AK': { name: 'Alaska', rate: 1.76 },
    'AZ': { name: 'Arizona', rate: 8.40 }, 'AR': { name: 'Arkansas', rate: 9.47 },
    'CA': { name: 'California', rate: 8.68 }, 'CO': { name: 'Colorado', rate: 7.77 },
    'CT': { name: 'Connecticut', rate: 6.35 }, 'DE': { name: 'Delaware', rate: 0.00 },
    'FL': { name: 'Florida', rate: 7.02 }, 'GA': { name: 'Georgia', rate: 7.35 },
    'HI': { name: 'Hawaii', rate: 4.44 }, 'ID': { name: 'Idaho', rate: 6.02 },
    'IL': { name: 'Illinois', rate: 8.81 }, 'IN': { name: 'Indiana', rate: 7.00 },
    'IA': { name: 'Iowa', rate: 6.94 }, 'KS': { name: 'Kansas', rate: 8.70 },
    'KY': { name: 'Kentucky', rate: 6.00 }, 'LA': { name: 'Louisiana', rate: 9.55 },
    'ME': { name: 'Maine', rate: 5.50 }, 'MD': { name: 'Maryland', rate: 6.00 },
    'MA': { name: 'Massachusetts', rate: 6.25 }, 'MI': { name: 'Michigan', rate: 6.00 },
    'MN': { name: 'Minnesota', rate: 7.49 }, 'MS': { name: 'Mississippi', rate: 7.07 },
    'MO': { name: 'Missouri', rate: 8.29 }, 'MT': { name: 'Montana', rate: 0.00 },
    'NE': { name: 'Nebraska', rate: 6.94 }, 'NV': { name: 'Nevada', rate: 8.23 },
    'NH': { name: 'New Hampshire', rate: 0.00 }, 'NJ': { name: 'New Jersey', rate: 6.63 },
    'NM': { name: 'New Mexico', rate: 7.72 }, 'NY': { name: 'New York', rate: 8.52 },
    'NC': { name: 'North Carolina', rate: 6.98 }, 'ND': { name: 'North Dakota', rate: 6.96 },
    'OH': { name: 'Ohio', rate: 7.24 }, 'OK': { name: 'Oklahoma', rate: 8.98 },
    'OR': { name: 'Oregon', rate: 0.00 }, 'PA': { name: 'Pennsylvania', rate: 6.34 },
    'RI': { name: 'Rhode Island', rate: 7.00 }, 'SC': { name: 'South Carolina', rate: 7.44 },
    'SD': { name: 'South Dakota', rate: 6.40 }, 'TN': { name: 'Tennessee', rate: 9.55 },
    'TX': { name: 'Texas', rate: 8.20 }, 'UT': { name: 'Utah', rate: 7.19 },
    'VT': { name: 'Vermont', rate: 6.24 }, 'VA': { name: 'Virginia', rate: 5.75 },
    'WA': { name: 'Washington', rate: 9.29 }, 'WV': { name: 'West Virginia', rate: 6.55 },
    'WI': { name: 'Wisconsin', rate: 5.43 }, 'WY': { name: 'Wyoming', rate: 5.36 },
    'DC': { name: 'Washington DC', rate: 6.00 }
  };

  const taxRate = stateTaxRates[selectedState]?.rate || 8.52;

  const karatOptions = [
    { value: '24', label: '24K', purity: 0.999, desc: '99.9%' },
    { value: '22', label: '22K', purity: 0.916, desc: '91.6%' },
    { value: '18', label: '18K', purity: 0.750, desc: '75.0%' },
    { value: '14', label: '14K', purity: 0.583, desc: '58.3%' },
    { value: '10', label: '10K', purity: 0.417, desc: '41.7%' }
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
    { value: 'detailed', label: 'Detailed', markup: 40 },
    { value: 'diamond_cut', label: 'Diamond Cut', markup: 40 },
    { value: 'character', label: 'Character', markup: 42 },
    { value: 'iced', label: 'Iced/CZ', markup: 55 },
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

  const jadeTypes = [{ value: 'jadeite', label: 'Jadeite', mult: 1 }, { value: 'nephrite', label: 'Nephrite', mult: 0.15 }];
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

  const glossary = [
    { term: 'Karat (K)', definition: 'Measurement of gold purity. 24K is pure gold (99.9%), 18K is 75% gold, 14K is 58.3% gold, 10K is 41.7% gold.' },
    { term: 'Melt Value', definition: 'The intrinsic value of gold based on its weight and purity at current spot prices. This is the minimum value of the piece.' },
    { term: 'Spot Price', definition: 'The current market price for immediate delivery of gold, updated in real-time based on global markets.' },
    { term: 'Premium', definition: 'The amount above melt value charged for craftsmanship, design, and retail markup. Typically 20-50% for gold jewelry.' },
    { term: 'Jadeite', definition: 'The more valuable type of jade, highly prized for its vibrant colors and translucency. Can be worth 10-100x more than nephrite.' },
    { term: 'Nephrite', definition: 'The more common type of jade, typically less valuable than jadeite but still used in quality jewelry and carvings.' },
    { term: 'Type A Jade', definition: 'Natural, untreated jade with no chemical processing. The most valuable grade, retains full market value.' },
    { term: 'Type B Jade', definition: 'Jade that has been bleached and polymer-impregnated to improve appearance. Worth ~10% of Type A value.' },
    { term: 'Type C Jade', definition: 'Jade that has been artificially dyed. Significantly less valuable, worth ~5% of Type A value.' },
    { term: 'Imperial Green', definition: 'The most valuable jade color - a vivid, emerald-like green. Can command prices of $10,000+ per carat for top quality.' },
    { term: 'Translucency', definition: 'How much light passes through jade. Transparent jade is most valuable, followed by semi-transparent, translucent, and opaque.' },
    { term: 'Solid Gold', definition: 'Gold that is uniform throughout (not plated or filled). The karat stamp indicates the purity of the entire piece.' },
    { term: 'Hollow', definition: 'Jewelry with a hollow interior to reduce weight and cost while maintaining appearance. Lighter weight means lower melt value.' },
    { term: 'Cuban Link', definition: 'A popular chain style with thick, interlocking oval links. Higher markup due to complex manufacturing and current popularity.' },
    { term: 'Rhodium Plating', definition: 'A thin coating of rhodium (white metal) applied to gold to create a bright white finish. Common on white gold pieces.' },
    { term: 'Two-Tone', definition: 'Jewelry featuring two different gold colors (yellow/white, yellow/rose, etc.). Higher markup due to additional craftsmanship.' },
    { term: 'Cabochon', definition: 'A gemstone that has been shaped and polished rather than faceted. Common style for jade rings and pendants.' },
    { term: 'Sales Tax', definition: 'State and local taxes added to jewelry purchases. CalGeo adjusts calculations based on your selected state (0-9.55%).' }
  ];

  // ==================== HELPERS ====================
  const getKaratPurity = (k) => karatOptions.find(o => o.value === k)?.purity || 0.999;
  const getChainMarkup = (s) => chainStyles.find(o => o.value === s)?.markup || 35;
  const getCharmMarkup = (s) => charmStyles.find(o => o.value === s)?.markup || 25;
  const getMetalMult = (m) => metalCombos.find(o => o.value === m)?.mult || 1;
  const getSpotForKarat = (k) => spotPrice24k * getKaratPurity(k);
  const canAnalyze = () => userTier === 'expert' || (userTier === 'pro' ? analysisCount < 50 : analysisCount < MAX_FREE_ANALYSES);

  // ==================== MAP FUNCTIONS ====================
  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => console.error('Google Maps failed to load. Check your API key and billing settings.');
    document.head.appendChild(script);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
  };

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.google) return;

    const newMap = new window.google.maps.Map(mapContainerRef.current, {
      center: userLocation,
      zoom: 13,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        }
      ]
    });

    setMap(newMap);

    // Add user location marker
    new window.google.maps.Marker({
      position: userLocation,
      map: newMap,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2
      },
      title: 'Your Location'
    });

    // Listen for map bounds changes to update visible results
    newMap.addListener('idle', () => {
      updateVisibleResults(newMap);
    });
  };

  const searchNearbyJewelry = async () => {
    if (!map || !window.google) return;

    setIsSearching(true);

    // If search query looks like a location (zipcode, city), geocode it first
    if (mapSearchQuery && mapSearchQuery.trim()) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: mapSearchQuery }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          map.setZoom(13);
          performPlacesSearch(location);
        } else {
          // If geocoding fails, search in current map center
          performPlacesSearch(map.getCenter());
        }
      });
    } else {
      // No search query, search around current map center
      performPlacesSearch(map.getCenter());
    }
  };

  const performPlacesSearch = (location) => {
    if (!map || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: 5000, // 5km radius
      keyword: 'jewelry store gold jade',
      type: 'jewelry_store'
    };

    service.nearbySearch(request, (results, status) => {
      setIsSearching(false);

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Clear old markers
        markers.forEach(marker => marker.setMap(null));

        // Store full results
        setSearchResults(results);

        // Add new markers
        const newMarkers = results.map((place, index) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            label: {
              text: `${index + 1}`,
              color: '#000',
              fontSize: '12px',
              fontWeight: 'bold'
            },
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="#d4af37" stroke="#000" stroke-width="2"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(36, 36),
              labelOrigin: new window.google.maps.Point(18, 18)
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="color: #000; padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600;">${place.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${place.vicinity}</p>
                ${place.rating ? `<p style="margin: 4px 0 0 0; font-size: 12px;">⭐ ${place.rating}/5 (${place.user_ratings_total || 0} reviews)</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // Store place data with marker
          marker.placeData = place;
          marker.placeIndex = index;

          return marker;
        });

        setMarkers(newMarkers);
      } else {
        setSearchResults([]);
      }
    });
  };

  const updateVisibleResults = (mapInstance) => {
    if (!mapInstance || markers.length === 0) return;

    const bounds = mapInstance.getBounds();
    if (!bounds) return;

    const visibleResults = searchResults.filter((place) => {
      return bounds.contains(place.geometry.location);
    });

    // Update search results to show only visible ones
    if (visibleResults.length !== searchResults.length) {
      setSearchResults(visibleResults);
    }
  };

  const centerOnPlace = (place, index) => {
    if (!map) return;

    map.panTo(place.geometry.location);
    map.setZoom(15);

    // Find and click the corresponding marker
    const marker = markers.find(m => m.placeIndex === index);
    if (marker) {
      window.google.maps.event.trigger(marker, 'click');
    }
  };

  // ==================== API FUNCTIONS ====================
  const refreshSpotPrice = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/spot-price');
      if (res.ok) {
        const data = await res.json();
        setSpotPrice24k(data.price_per_gram || data.karats?.['24'] || 84.20);
        setSpotPriceSilver(data.silver_per_gram || 0.98);
        setPriceSource(data.source || 'api');
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Spot price error:', e);
      setPriceSource('cached');
    }
    setIsRefreshing(false);
  };

  // Load user data from Supabase database
  const loadUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUserTier(data.tier || 'free');
        setScanCount(data.scan_count || 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage if database fails
      const saved = localStorage.getItem('calgeo_tier');
      const scans = localStorage.getItem('calgeo_scans');
      if (saved) setUserTier(saved);
      if (scans) setScanCount(parseInt(scans));
    }
  };

  // Sync user data to Supabase database
  const syncUserData = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          tier: userTier,
          scan_count: scanCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setIsLoggedIn(true);
    loadUserData(authenticatedUser.id);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsLoggedIn(false);
      setUserTier('free');
      setScanCount(0);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const searchPlaces = async (query) => {
    if (!query || query.length < 2) { setPlaceResults([]); return; }
    setIsSearchingPlaces(true);
    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setPlaceResults(data.results || []);
      }
    } catch (e) { console.error('Places error:', e); }
    setIsSearchingPlaces(false);
  };

  const analyzeImage = async () => {
    if (!canAnalyze()) { setShowUpgrade(true); return; }
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imagePreview, mode: analysisMode })
      });
      
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        
        // Update analysis count
        const newCount = analysisCount + 1;
        setAnalysisCount(newCount);
        localStorage.setItem('calgeo_analyses', newCount.toString());
        
        // Auto-fill form fields based on detection
        if (data.type === 'gold' && data.detected) {
          if (data.detected.estimatedKarat) setChainKarat(data.detected.estimatedKarat);
          if (data.detected.style) setChainStyle(data.detected.style);
          if (data.detected.metalColor) setChainMetal(data.detected.metalColor);
          if (data.detected.hasCharm) {
            setIncludeCharm(true);
            if (data.detected.charmType) setCharmStyle(data.detected.charmType);
          }
        } else if (data.type === 'jade' && data.detected) {
          if (data.detected.stoneType) setJadeType(data.detected.stoneType);
          if (data.detected.estimatedGrade) setJadeGrade(data.detected.estimatedGrade);
          if (data.detected.color) setJadeColor(data.detected.color);
          if (data.detected.translucency) setJadeTranslucency(data.detected.translucency);
          if (data.detected.itemType) setJadeItem(data.detected.itemType);
          if (data.detected.size) setJadeSize(data.detected.size);
        }
        
        addToHistory({ type: 'scan', ...data });
      }
    } catch (e) { console.error('Analysis error:', e); }
    setIsAnalyzing(false);
  };

  // ==================== DATA FUNCTIONS ====================
  const addToHistory = (entry) => {
    setHistory(prev => [{ id: Date.now(), timestamp: new Date().toLocaleString(), ...entry }, ...prev].slice(0, 100));
  };

  const addToShoppingList = () => {
    if (!newShop.name || !newShop.item || !newShop.price) return;
    setShoppingList(prev => [...prev, { id: Date.now(), ...newShop, price: parseFloat(newShop.price) }]);
    setNewShop({ name: '', address: '', item: '', price: '', notes: '', rating: '' });
    setPlaceSearch('');
    setShowAddShop(false);
  };

  const selectPlace = (place) => {
    setNewShop(prev => ({ ...prev, name: place.name, address: place.address, rating: place.rating }));
    setPlaceSearch(place.name);
    setPlaceResults([]);
  };

  const getBestDeal = () => shoppingList.length ? shoppingList.reduce((min, i) => i.price < min.price ? i : min) : null;

  // Handle first-visit splash discount checkout
  const handleSplashCheckout = async () => {
    // Mark splash as seen
    localStorage.setItem('calgeo_seen_splash', 'true');
    localStorage.setItem('calgeo_user_created', new Date().toISOString());

    // Close splash and initiate discounted checkout
    setShowSplash(false);

    // Call checkout with discount parameter
    try {
      console.log('Initiating first-visit discount checkout');
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'pro',
          userId: userId,
          email: splashEmail,
          discount: 20, // 20% off first visit
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const error = await res.json();
        alert('Checkout failed: ' + (error.error || 'Unknown error'));
      }
    } catch (e) {
      console.error('Splash checkout error:', e);
      alert('Error starting checkout: ' + e.message);
    }
  };

  const handleSplashDismiss = () => {
    localStorage.setItem('calgeo_seen_splash', 'true');
    setShowSplash(false);
  };

  // ==================== CALCULATIONS ====================
  const goldCalc = useMemo(() => {
    const cW = parseFloat(chainWeight) || 0;
    const cP = parseFloat(chainPrice) || 0;
    const chW = parseFloat(charmWeight) || 0;
    const chP = parseFloat(charmPrice) || 0;
    
    const chainSpot = getSpotForKarat(chainKarat);
    const chainMelt = cW * chainSpot;
    const chainExp = getChainMarkup(chainStyle) * getMetalMult(chainMetal);
    let chainPreTax = cP;
    if (includeTax && cP > 0) chainPreTax = cP / (1 + taxRate / 100);

    let charmMelt = 0, charmPreTax = 0, charmExp = 0;
    if (includeCharm && chW > 0) {
      charmMelt = chW * getSpotForKarat(charmKarat);
      charmExp = getCharmMarkup(charmStyle) * getMetalMult(charmMetal);
      charmPreTax = chP;
      if (includeTax && chP > 0) charmPreTax = chP / (1 + taxRate / 100);
    }

    const totalMelt = chainMelt + charmMelt;
    const totalPreTax = chainPreTax + charmPreTax;
    const totalPremium = totalPreTax - totalMelt;
    const totalPct = totalMelt > 0 ? (totalPremium / totalMelt) * 100 : 0;
    const weightedExp = totalMelt > 0 ? ((chainMelt * chainExp) + (charmMelt * charmExp)) / totalMelt : chainExp;

    return {
      melt: totalMelt,
      preTax: totalPreTax,
      premium: totalPremium,
      pct: totalPct,
      expected: weightedExp,
      targets: {
        aggressive: totalMelt * (1 + weightedExp * 0.85 / 100),
        fair: totalMelt * (1 + weightedExp / 100),
        max: totalMelt * (1 + weightedExp * 1.15 / 100)
      }
    };
  }, [chainWeight, chainPrice, chainKarat, chainStyle, chainMetal, charmWeight, charmPrice, charmKarat, charmStyle, charmMetal, includeCharm, includeTax, taxRate, spotPrice24k]);

  const jadeCalc = useMemo(() => {
    const ask = parseFloat(jadePrice) || 0;
    const item = jadeItems.find(i => i.value === jadeItem);
    const expected = (item?.base || 500) * (item?.sizes[jadeSize] || 1) *
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

  // Grade helpers
  const getGrade = (actual, exp) => {
    const diff = actual - exp;
    if (diff <= -10) return { grade: 'STEAL', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', emoji: '🔥' };
    if (diff <= 5) return { grade: 'GOOD', color: '#10b981', bg: 'rgba(16,185,129,0.15)', emoji: '✓' };
    if (diff <= 15) return { grade: 'FAIR', color: '#eab308', bg: 'rgba(234,179,8,0.15)', emoji: '⚖️' };
    if (diff <= 25) return { grade: 'HIGH', color: '#f97316', bg: 'rgba(249,115,22,0.15)', emoji: '⚠️' };
    return { grade: 'OVERPAY', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', emoji: '🚫' };
  };

  const getJadeGrade = (ratio) => {
    if (ratio <= 0.5) return { grade: 'STEAL', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', emoji: '🔥' };
    if (ratio <= 0.8) return { grade: 'GOOD', color: '#10b981', bg: 'rgba(16,185,129,0.15)', emoji: '✓' };
    if (ratio <= 1.2) return { grade: 'FAIR', color: '#eab308', bg: 'rgba(234,179,8,0.15)', emoji: '⚖️' };
    if (ratio <= 1.8) return { grade: 'HIGH', color: '#f97316', bg: 'rgba(249,115,22,0.15)', emoji: '⚠️' };
    return { grade: 'OVERPAY', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', emoji: '🚫' };
  };

  const goldGrade = getGrade(goldCalc.pct, goldCalc.expected);
  const jadeGradeResult = getJadeGrade(jadeCalc.ratio);
  const hasGoldInput = parseFloat(chainWeight) > 0 && parseFloat(chainPrice) > 0;
  const bestDeal = getBestDeal();

  // ==================== STYLES ====================
  // Theme-aware colors inspired by One app
  const getColors = () => {
    // Determine effective theme
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (effectiveTheme === 'light') {
      return {
        bg: '#f5f5f5', bgCard: '#ffffff', border: 'rgba(0,0,0,0.12)',
        gold: '#c69f40', jade: '#059669', scan: '#7c3aed', list: '#ea580c', history: '#4f46e5',
        text: '#0a0a0a', muted: '#666666', success: '#16a34a', warning: '#ea580c', danger: '#dc2626',
        cardShadow: '0 1px 3px rgba(0,0,0,0.08)',
        inputBg: '#fafafa', inputBorder: 'rgba(0,0,0,0.15)'
      };
    }
    // Dark mode (default) - inspired by One app
    return {
      bg: '#0a0a0a', bgCard: '#1a1a1a', border: 'rgba(255,255,255,0.15)',
      gold: '#e5c158', jade: '#10b981', scan: '#a78bfa', list: '#fb923c', history: '#818cf8',
      text: '#ffffff', muted: '#9ca3af', success: '#22c55e', warning: '#fb923c', danger: '#ef4444',
      cardShadow: '0 1px 3px rgba(0,0,0,0.3)',
      inputBg: 'rgba(0,0,0,0.3)', inputBorder: 'rgba(255,255,255,0.2)'
    };
  };

  const colors = getColors();
  const effectiveTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

  // Grid helpers for layout

  // ==================== RENDER ====================
  return (
    <div className="bg-primary" style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* SIDEBAR OVERLAY (Mobile only) */}
      {showSidebar && isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999
          }}
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside style={{
        position: 'fixed',
        left: showSidebar || !isMobile ? 0 : '-70px',
        top: 0,
        bottom: 0,
        width: '70px',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, #0a0a10 100%)',
        borderRight: `1px solid ${colors.gold}30`,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '80px',
        gap: '8px',
        overflowY: 'auto',
        transition: 'left 0.3s ease'
      }}>
        {[
          { id: 'gold', label: 'Gold', color: colors.gold, useText: true },
          { id: 'silver', label: 'Silver', color: '#c0c0c0', useText: true },
          { id: 'jade', label: 'Jade', color: colors.jade, useText: true },
          { id: 'scan', label: 'Scan', color: colors.scan, useText: true },
          { id: 'tools', icon: '🔧', label: 'Tools', color: '#f59e0b', useText: false },
          { id: 'glossary', icon: '📖', label: 'Terms', color: '#8b5cf6', useText: false },
          { id: 'guide', icon: '📋', label: 'Guide', color: '#06b6d4', useText: false }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              if (isMobile) setShowSidebar(false);
            }}
            title={t.label}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              border: activeTab === t.id ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === t.id ? `${t.color}20` : 'rgba(255,255,255,0.05)',
              color: activeTab === t.id ? t.color : colors.muted,
              fontSize: t.useText ? '11px' : '24px',
              fontWeight: t.useText ? '700' : 'normal',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === t.id ? `0 0 20px ${t.color}40` : 'none'
            }}
          >
            {t.useText ? t.label : t.icon}
          </button>
        ))}
      </aside>

      {/* HEADER */}
      <header style={{
        background: effectiveTheme === 'light' ? '#ffffff' : 'var(--bg-secondary)',
        borderBottom: '1px solid var(--primary-600)',
        padding: isMobile ? '12px' : 'var(--space-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-sm)',
        marginLeft: isMobile ? '0' : '70px',
        gap: '12px'
      }}>
        {/* Left: Sidebar Toggle (Mobile only) */}
        {isMobile && (
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="btn-icon"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${colors.gold}30`,
              borderRadius: '8px',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ width: '16px', height: '2px', background: colors.gold, borderRadius: '2px' }}></div>
              <div style={{ width: '16px', height: '2px', background: colors.gold, borderRadius: '2px' }}></div>
              <div style={{ width: '16px', height: '2px', background: colors.gold, borderRadius: '2px' }}></div>
            </div>
          </button>
        )}

        {/* Center/Left: Logo */}
        <div style={{
          position: isMobile ? 'relative' : 'absolute',
          left: isMobile ? 'auto' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          flex: isMobile ? '1' : 'auto'
        }}>
          <CalGeoLogo size={isMobile ? 28 : 34} />
        </div>

        {/* Right: Menu button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="btn-icon"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${colors.gold}30`,
            borderRadius: '8px',
            flexShrink: 0
          }}
        >
          <div style={{ width: '16px', height: '2px', background: colors.gold, borderRadius: '2px' }}></div>
          <div style={{ width: '16px', height: '2px', background: colors.gold, borderRadius: '2px' }}></div>
          <div style={{ width: '16px', height: '2px', background: colors.gold, borderRadius: '2px' }}></div>
        </button>
      </header>

      <main style={{
        marginLeft: isMobile ? '0' : '70px',
        width: isMobile ? '100%' : 'calc(100% - 70px)',
        display: 'flex',
        justifyContent: 'center',
        padding: 'var(--space-md) var(--space-md) 100px'
      }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* ========== GOLD TAB ========== */}
        {activeTab === 'gold' && (
          <>
            {/* Spot Price */}
            <div className="card" style={{background: `linear-gradient(135deg, ${colors.gold}12, ${colors.gold}05)`, border: `1px solid ${colors.gold}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: colors.muted, textTransform: 'uppercase' }}>Live Spot Price</span>
                <span style={{ fontSize: '9px', color: colors.muted }}>{lastUpdated && `${lastUpdated}`}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={spotPriceKarat} onChange={(e) => setSpotPriceKarat(e.target.value)} className="select" style={{minWidth: '110px', flex: 'none', fontSize: '13px' }}>
                  {karatOptions.map(o => <option key={o.value} value={o.value}>{o.label} ({o.desc})</option>)}
                </select>
                <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
                    <span style={{ color: colors.gold, fontFamily: 'monospace', fontWeight: '700', fontSize: '22px' }}>${getSpotForKarat(spotPriceKarat).toFixed(2)}</span>
                    <span style={{ color: colors.muted, fontSize: '11px' }}>/g</span>
                  </div>
                  {priceSource && (
                    <div style={{ fontSize: '8px', color: colors.muted, marginTop: '2px' }}>
                      Source: {priceSource === 'api' ? 'Gold API' : priceSource === 'cached' ? 'Cached' : priceSource}
                    </div>
                  )}
                </div>
                <button onClick={refreshSpotPrice} disabled={isRefreshing} className="btn-gold" style={{padding: '8px 12px', flex: 'none' }}>{isRefreshing ? '⏳' : '🔄'}</button>
              </div>
            </div>

            {/* Tax */}
            <div className="card">
              <div className="grid2">
                <div>
                  <label className="label">State</label>
                  <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="select">
                    {Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, d]) => <option key={code} value={code}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Sales Tax</label>
                  <div style={{ padding: '10px', background: `${colors.gold}15`, border: `1px solid ${colors.gold}30`, borderRadius: '8px', fontFamily: 'monospace', color: colors.gold, textAlign: 'center' }}>{taxRate.toFixed(2)}%</div>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '12px', color: colors.muted, cursor: 'pointer' }}>
                <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} /> Prices include sales tax
              </label>
            </div>

            {/* Chain */}
            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: colors.gold }}>⛓️ Chain</div>
              <div className="grid2" style={{marginBottom: '10px' }}>
                <div><label className="label">Karat</label><select value={chainKarat} onChange={(e) => setChainKarat(e.target.value)} className="select">{karatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label">Style</label><select value={chainStyle} onChange={(e) => setChainStyle(e.target.value)} className="select">{chainStyles.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div className="grid3">
                <div><label className="label">Metal</label><select value={chainMetal} onChange={(e) => setChainMetal(e.target.value)} className="select">{metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label">Weight (g)</label><input type="number" value={chainWeight} onChange={(e) => setChainWeight(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
                <div><label className="label">Price ($)</label><input type="number" value={chainPrice} onChange={(e) => setChainPrice(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
              </div>
            </div>

            {/* Add Charm */}
            <div className="card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', color: colors.gold }}>
                <input type="checkbox" checked={includeCharm} onChange={(e) => setIncludeCharm(e.target.checked)} style={{ width: '16px', height: '16px' }} /> ➕ Add Charm
              </label>
            </div>

            {includeCharm && (
              <div className="card" style={{border: `1px solid ${colors.gold}40` }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: colors.gold }}>🏅 Charm</div>
                <div className="grid2" style={{marginBottom: '10px' }}>
                  <div><label className="label">Karat</label><select value={charmKarat} onChange={(e) => setCharmKarat(e.target.value)} className="select">{karatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                  <div><label className="label">Style</label><select value={charmStyle} onChange={(e) => setCharmStyle(e.target.value)} className="select">{charmStyles.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                </div>
                <div className="grid3">
                  <div><label className="label">Metal</label><select value={charmMetal} onChange={(e) => setCharmMetal(e.target.value)} className="select">{metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                  <div><label className="label">Weight (g)</label><input type="number" value={charmWeight} onChange={(e) => setCharmWeight(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
                  <div><label className="label">Price ($)</label><input type="number" value={charmPrice} onChange={(e) => setCharmPrice(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
                </div>
              </div>
            )}

            {/* Results */}
            {hasGoldInput && (
              <div className="card" style={{background: goldGrade.bg, border: `1px solid ${goldGrade.color}50` }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '42px', marginBottom: '4px' }}>{goldGrade.emoji}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: goldGrade.color }}>{goldGrade.grade}</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'monospace', color: goldGrade.color }}>{goldCalc.pct.toFixed(1)}%</div>
                  <div style={{ fontSize: '11px', color: colors.muted }}>markup vs expected ~{goldCalc.expected.toFixed(0)}%</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}><span style={{ color: colors.muted }}>Melt Value</span><span style={{ color: colors.success, fontFamily: 'monospace', fontWeight: '600' }}>${goldCalc.melt.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}><span style={{ color: colors.muted }}>Asking (pre-tax)</span><span style={{ fontFamily: 'monospace', fontWeight: '600' }}>${goldCalc.preTax.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px' }}><span style={{ color: colors.muted }}>Premium</span><span style={{ color: goldCalc.premium > 0 ? '#f97316' : colors.success, fontFamily: 'monospace', fontWeight: '600' }}>${goldCalc.premium.toFixed(2)}</span></div>
                </div>

                {/* Negotiation Targets - Show upgrade CTA for free users */}
                {userTier === 'free' ? (
                  <div style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${colors.gold}40`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gold, marginBottom: '6px' }}>Unlock Negotiation Targets</div>
                    <div style={{ fontSize: '11px', color: colors.muted, marginBottom: '12px' }}>Get AI-powered price points: Aggressive, Fair, and Max offers</div>
                    <button onClick={() => setShowUpgrade(true)} className="btn-gold" style={{width: '100%' }}>⬆️ Upgrade to Pro</button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '10px', color: colors.muted, textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>💬 Negotiation Targets</div>
                    {[
                      { label: '🔥 Aggressive', value: goldCalc.targets.aggressive, color: colors.success },
                      { label: '✓ Fair', value: goldCalc.targets.fair, color: '#10b981' },
                      { label: '⚖️ Max', value: goldCalc.targets.max, color: colors.warning }
                    ].map(t => (
                      <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${t.color}15`, border: `1px solid ${t.color}30`, borderRadius: '8px', padding: '10px 14px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px' }}>{t.label}</span>
                        <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'monospace', color: t.color }}>${t.value.toFixed(0)}</span>
                      </div>
                    ))}
                  </>
                )}
                <button onClick={() => addToHistory({ type: 'gold', grade: goldGrade.grade, pct: goldCalc.pct.toFixed(1), melt: goldCalc.melt.toFixed(2), price: goldCalc.preTax.toFixed(2), karat: chainKarat, style: chainStyle })} className="btn-secondary" style={{width: '100%', marginTop: '10px', background: 'rgba(255,255,255,0.08)', color: '#aaa', border: `1px solid ${colors.border}` }}>📜 Save to History</button>
              </div>
            )}
          </>
        )}

        {/* ========== SILVER TAB ========== */}
        {activeTab === 'silver' && (
          <>
            {/* Spot Price */}
            <div className="card" style={{background: `linear-gradient(135deg, #c0c0c012, #c0c0c005)`, border: `1px solid #c0c0c030` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: colors.muted, textTransform: 'uppercase' }}>Live Silver Spot Price</span>
                <span style={{ fontSize: '9px', color: colors.muted }}>{lastUpdated && `${lastUpdated}`}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
                    <span style={{ color: '#c0c0c0', fontFamily: 'monospace', fontWeight: '700', fontSize: '22px' }}>${spotPriceSilver.toFixed(2)}</span>
                    <span style={{ color: colors.muted, fontSize: '11px' }}>/g</span>
                  </div>
                  {priceSource && (
                    <div style={{ fontSize: '8px', color: colors.muted, marginTop: '2px' }}>
                      Source: {priceSource === 'api' ? 'Silver API' : priceSource === 'cached' ? 'Cached' : priceSource}
                    </div>
                  )}
                </div>
                <button onClick={refreshSpotPrice} disabled={isRefreshing} className="btn-secondary" style={{background: `linear-gradient(135deg, #c0c0c0, #a8a8a8)`, color: '#000', padding: '8px 12px', flex: 'none' }}>{isRefreshing ? '⏳' : '🔄'}</button>
              </div>
            </div>

            {/* Tax */}
            <div className="card">
              <div className="grid2">
                <div><label className="label">State</label><select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="select">{Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, d]) => <option key={code} value={code}>{d.name}</option>)}</select></div>
                <div><label className="label">Sales Tax</label><div style={{ padding: '10px', background: `#c0c0c015`, border: `1px solid #c0c0c030`, borderRadius: '8px', fontFamily: 'monospace', color: '#c0c0c0', textAlign: 'center' }}>{taxRate.toFixed(2)}%</div></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '12px', color: colors.muted, cursor: 'pointer' }}>
                <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} /> Prices include sales tax
              </label>
            </div>

            {/* Chain */}
            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: '#c0c0c0' }}>⛓️ Silver Chain</div>
              <div className="grid2" style={{marginBottom: '10px' }}>
                <div><label className="label">Purity</label><select value={chainKarat} onChange={(e) => setChainKarat(e.target.value)} className="select"><option value="999">99.9% Pure</option><option value="925">Sterling (92.5%)</option><option value="900">Coin Silver (90%)</option></select></div>
                <div><label className="label">Style</label><select value={chainStyle} onChange={(e) => setChainStyle(e.target.value)} className="select">{chainStyles.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div className="grid3">
                <div><label className="label">Metal</label><select value={chainMetal} onChange={(e) => setChainMetal(e.target.value)} className="select">{metalCombos.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label">Weight (g)</label><input type="number" value={chainWeight} onChange={(e) => setChainWeight(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
                <div><label className="label">Price ($)</label><input type="number" value={chainPrice} onChange={(e) => setChainPrice(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
              </div>
            </div>

            {/* Results for Silver */}
            {hasGoldInput && (
              <div className="card" style={{background: '#c0c0c010', border: `1px solid #c0c0c030` }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '42px', marginBottom: '4px' }}>⚪</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c0c0c0' }}>SILVER</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'monospace', color: '#c0c0c0' }}>${(parseFloat(chainWeight) * spotPriceSilver || 0).toFixed(2)}</div>
                  <div style={{ fontSize: '11px', color: colors.muted }}>melt value</div>
                </div>
                <div style={{ fontSize: '11px', color: colors.muted, textAlign: 'center', marginBottom: '12px' }}>
                  Silver valuation coming soon. Current display shows melt value only.
                </div>
                <button onClick={() => addToHistory({ type: 'silver', melt: (parseFloat(chainWeight) * spotPriceSilver).toFixed(2), price: chainPrice, weight: chainWeight })} className="btn-secondary" style={{width: '100%', background: 'rgba(255,255,255,0.08)', color: '#aaa', border: `1px solid ${colors.border}` }}>📜 Save to History</button>
              </div>
            )}
          </>
        )}

        {/* ========== JADE TAB ========== */}
        {activeTab === 'jade' && (
          <>
            <div className="card">
              <div className="grid2">
                <div><label className="label">State</label><select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="select">{Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, d]) => <option key={code} value={code}>{d.name}</option>)}</select></div>
                <div><label className="label">Sales Tax</label><div style={{ padding: '10px', background: `${colors.jade}15`, border: `1px solid ${colors.jade}30`, borderRadius: '8px', fontFamily: 'monospace', color: colors.jade, textAlign: 'center' }}>{taxRate.toFixed(2)}%</div></div>
              </div>
            </div>
            <div className="card">
              <div className="grid2" style={{marginBottom: '10px' }}>
                <div><label className="label">Stone Type</label><select value={jadeType} onChange={(e) => setJadeType(e.target.value)} className="select">{jadeTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label">Grade</label><select value={jadeGrade} onChange={(e) => setJadeGrade(e.target.value)} className="select">{jadeGrades.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div className="grid2" style={{marginBottom: '10px' }}>
                <div><label className="label">Color</label><select value={jadeColor} onChange={(e) => setJadeColor(e.target.value)} className="select">{jadeColors.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label">Translucency</label><select value={jadeTranslucency} onChange={(e) => setJadeTranslucency(e.target.value)} className="select">{jadeTranslucencies.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div className="grid2" style={{marginBottom: '10px' }}>
                <div><label className="label">Item</label><select value={jadeItem} onChange={(e) => setJadeItem(e.target.value)} className="select">{jadeItems.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label">Size</label><select value={jadeSize} onChange={(e) => setJadeSize(e.target.value)} className="select"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
              </div>
              <div><label className="label">Asking Price ($)</label><input type="number" value={jadePrice} onChange={(e) => setJadePrice(e.target.value)} placeholder="0.00" className="input" step="0.01" /></div>
            </div>
            {parseFloat(jadePrice) > 0 && (
              <div className="card" style={{background: jadeGradeResult.bg, border: `1px solid ${jadeGradeResult.color}50` }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '42px', marginBottom: '4px' }}>{jadeGradeResult.emoji}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: jadeGradeResult.color }}>{jadeGradeResult.grade}</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'monospace', color: jadeGradeResult.color }}>{(jadeCalc.ratio * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: '11px', color: colors.muted }}>of expected value</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}><span style={{ color: colors.muted }}>Expected</span><span style={{ color: colors.jade, fontFamily: 'monospace', fontWeight: '600' }}>${jadeCalc.expected.toFixed(0)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}><span style={{ color: colors.muted }}>Range</span><span style={{ fontFamily: 'monospace' }}>${jadeCalc.low.toFixed(0)} - ${jadeCalc.high.toFixed(0)}</span></div>
                </div>
                {jadeCalc.redFlags.length > 0 && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>{jadeCalc.redFlags.map((f, i) => <div key={i} style={{ fontSize: '11px', color: colors.danger }}>⚠️ {f}</div>)}</div>}

                {/* Counter-Offers - Show upgrade CTA for free users */}
                {userTier === 'free' ? (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: `1px solid ${colors.jade}40`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.jade, marginBottom: '6px' }}>Unlock Counter-Offer Strategy</div>
                    <div style={{ fontSize: '11px', color: colors.muted, marginBottom: '12px' }}>Get calculated negotiation prices for jade purchases</div>
                    <button onClick={() => setShowUpgrade(true)} className="btn-secondary" style={{background: `linear-gradient(135deg, ${colors.jade}, #059669)`, color: '#000', width: '100%' }}>⬆️ Upgrade to Pro</button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '10px', color: colors.muted, textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>💬 Counter-Offers</div>
                    {[
                      { label: '🔥 Aggressive (50%)', value: jadeCalc.expected * 0.5, color: colors.success },
                      { label: '✓ Target (80%)', value: jadeCalc.expected * 0.8, color: '#10b981' },
                      { label: '⚖️ Max (100%)', value: jadeCalc.expected, color: colors.warning }
                    ].map(t => (
                      <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${t.color}15`, border: `1px solid ${t.color}30`, borderRadius: '8px', padding: '10px 14px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px' }}>{t.label}</span>
                        <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'monospace', color: t.color }}>${t.value.toFixed(0)}</span>
                      </div>
                    ))}
                  </>
                )}
                <button onClick={() => addToHistory({ type: 'jade', grade: jadeGradeResult.grade, ratio: (jadeCalc.ratio * 100).toFixed(0), expected: jadeCalc.expected.toFixed(0), price: jadeCalc.preTax.toFixed(2) })} className="btn-secondary" style={{width: '100%', marginTop: '10px', background: 'rgba(255,255,255,0.08)', color: '#aaa', border: `1px solid ${colors.border}` }}>📜 Save to History</button>
              </div>
            )}
          </>
        )}

        {/* ========== SCAN TAB ========== */}
        {activeTab === 'scan' && (
          <>
            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: colors.scan }}>📸 AI Image Analysis</div>
              <div className="grid2" style={{marginBottom: '12px' }}>
                <button onClick={() => setAnalysisMode('auto')} className="btn-secondary" style={{background: analysisMode === 'auto' ? `${colors.scan}25` : 'transparent', border: `1px solid ${analysisMode === 'auto' ? colors.scan : colors.border}`, color: analysisMode === 'auto' ? colors.scan : colors.muted }}>🤖 Auto</button>
                <button onClick={() => setAnalysisMode('guided')} className="btn-secondary" style={{background: analysisMode === 'guided' ? `${colors.scan}25` : 'transparent', border: `1px solid ${analysisMode === 'guided' ? colors.scan : colors.border}`, color: analysisMode === 'guided' ? colors.scan : colors.muted }}>👆 Guided</button>
              </div>
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(f); setAnalysisResult(null); }}} ref={fileInputRef} style={{ display: 'none' }} />
              {!imagePreview ? (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: `2px dashed ${colors.scan}40`, borderRadius: '12px', padding: '36px', textAlign: 'center', cursor: 'pointer', background: `${colors.scan}08` }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>📷</div>
                  <div style={{ color: colors.scan, fontWeight: '500' }}>Tap to upload photo</div>
                </div>
              ) : (
                <div>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '10px', marginBottom: '10px' }} />
                  <div className="grid2">
                    <button onClick={() => { setImagePreview(null); setAnalysisResult(null); }} className="btn-secondary" style={{background: 'rgba(239,68,68,0.15)', color: colors.danger, border: '1px solid rgba(239,68,68,0.3)' }}>Clear</button>
                    <button onClick={analyzeImage} disabled={isAnalyzing} className="btn-gold">{isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze'}</button>
                  </div>
                </div>
              )}
            </div>
            {analysisResult && (
              <div className="card" style={{background: `${colors.scan}10`, border: `1px solid ${colors.scan}40` }}>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', color: colors.muted }}>CONFIDENCE</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: colors.scan }}>{((analysisResult.confidence || 0.85) * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: '11px', color: colors.muted }}>Detected: {analysisResult.type?.toUpperCase()}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                  {analysisResult.detected && Object.entries(analysisResult.detected).filter(([k, v]) => v !== null && v !== undefined).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '12px' }}>
                      <span style={{ color: colors.muted, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
                {analysisResult.warnings?.length > 0 && <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>{analysisResult.warnings.map((w, i) => <div key={i} style={{ fontSize: '11px', color: colors.warning }}>⚠️ {w}</div>)}</div>}
                <button onClick={() => { setActiveTab(analysisResult.type || 'gold'); setAnalysisResult(null); setImagePreview(null); }} className="btn-gold" style={{width: '100%' }}>Apply & Calculate →</button>
              </div>
            )}
          </>
        )}

        {/* ========== TOOLS TAB ========== */}
        {activeTab === 'tools' && (
          <>
            {/* Tools Sub-Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'history', icon: '📜', label: 'History' },
                { id: 'compare', icon: '🛒', label: 'Compare' },
                { id: 'map', icon: '🗺️', label: 'Map' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setToolsSubTab(sub.id)}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: toolsSubTab === sub.id ? '#f59e0b25' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${toolsSubTab === sub.id ? '#f59e0b' : colors.border}`,
                    color: toolsSubTab === sub.id ? '#f59e0b' : colors.muted,
                    fontSize: '13px',
                    fontWeight: toolsSubTab === sub.id ? '600' : '400'
                  }}
                >
                  {sub.icon} {sub.label}
                </button>
              ))}
            </div>

            {/* History Sub-Tab */}
            {toolsSubTab === 'history' && (
              <>
                {history.length > 0 && <div style={{ marginBottom: '10px' }}><span style={{ fontSize: '11px', color: colors.muted }}>{history.length} entries</span></div>}
                {history.length > 0 ? history.map((e) => (
                  <div key={e.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', color: colors.muted }}>{e.timestamp}</span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: e.type === 'gold' ? `${colors.gold}20` : e.type === 'jade' ? `${colors.jade}20` : `${colors.scan}20`, color: e.type === 'gold' ? colors.gold : e.type === 'jade' ? colors.jade : colors.scan, fontWeight: '600' }}>{e.type?.toUpperCase()}</span>
                    </div>
                    {e.grade && <div style={{ fontSize: '15px', fontWeight: '600', color: e.grade === 'STEAL' || e.grade === 'GOOD' ? colors.success : e.grade === 'FAIR' ? colors.warning : colors.danger }}>{e.grade}</div>}
                    <div style={{ fontSize: '11px', color: colors.muted }}>{e.pct && `${e.pct}% markup`}{e.ratio && ` • ${e.ratio}% ratio`}{e.price && ` • $${e.price}`}</div>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: '30px', color: colors.muted }}>📜 No history yet</div>}
              </>
            )}

            {/* Compare Sub-Tab */}
            {toolsSubTab === 'compare' && (
              <>
                <div className="card">
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: colors.list }}>🛒 Price Comparison</div>
                  {!showAddShop ? (
                    <button onClick={() => setShowAddShop(true)} className="btn-gold" style={{width: '100%' }}>➕ Add Shop Quote</button>
                  ) : (
                    <>
                      <div style={{ marginBottom: '10px', position: 'relative' }}>
                        <label className="label">Search Business</label>
                        <input type="text" value={placeSearch} onChange={(e) => { setPlaceSearch(e.target.value); searchPlaces(e.target.value); }} placeholder="Search jewelry shops..." className="input" />
                        {placeResults.length > 0 && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a24', border: `1px solid ${colors.border}`, borderRadius: '8px', marginTop: '4px', zIndex: 10, maxHeight: '150px', overflow: 'auto' }}>
                            {placeResults.map((p) => (
                              <div key={p.placeId} onClick={() => selectPlace(p)} style={{ padding: '10px', cursor: 'pointer', borderBottom: `1px solid ${colors.border}` }}>
                                <div style={{ fontWeight: '500', fontSize: '13px' }}>{p.name}</div>
                                <div style={{ fontSize: '10px', color: colors.muted }}>{p.address}</div>
                                {p.rating && <div style={{ fontSize: '10px', color: colors.list }}>⭐ {p.rating}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid2" style={{marginBottom: '10px' }}>
                        <div><label className="label">Shop Name</label><input type="text" value={newShop.name} onChange={(e) => setNewShop({ ...newShop, name: e.target.value })} className="input" /></div>
                        <div><label className="label">Price ($)</label><input type="number" value={newShop.price} onChange={(e) => setNewShop({ ...newShop, price: e.target.value })} className="input" /></div>
                      </div>
                      <div style={{ marginBottom: '10px' }}><label className="label">Item Description</label><input type="text" value={newShop.item} onChange={(e) => setNewShop({ ...newShop, item: e.target.value })} placeholder="24K Cuban 10g" className="input" /></div>
                      <div className="grid2">
                        <button onClick={() => { setShowAddShop(false); setNewShop({ name: '', address: '', item: '', price: '', notes: '', rating: '' }); }} className="btn-secondary" style={{background: 'rgba(255,255,255,0.08)', color: '#aaa', border: `1px solid ${colors.border}` }}>Cancel</button>
                        <button onClick={addToShoppingList} className="btn-gold">Add</button>
                      </div>
                    </>
                  )}
                </div>
                {bestDeal && shoppingList.length > 1 && (
                  <div style={{ background: `linear-gradient(90deg, ${colors.success}15, ${colors.success}08)`, border: `1px solid ${colors.success}40`, borderRadius: '12px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><div style={{ fontSize: '10px', color: colors.success, fontWeight: '600' }}>🏆 BEST DEAL</div><div style={{ fontWeight: '600' }}>{bestDeal.name}</div></div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: colors.success, fontFamily: 'monospace' }}>${bestDeal.price.toFixed(0)}</div>
                  </div>
                )}
                {shoppingList.length > 0 ? shoppingList.sort((a, b) => a.price - b.price).map((item, idx) => (
                  <div key={item.id} className="card" style={{border: item.id === bestDeal?.id ? `1px solid ${colors.success}50` : undefined, background: item.id === bestDeal?.id ? `${colors.success}08` : undefined }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div><div style={{ fontWeight: '600' }}>{idx === 0 && shoppingList.length > 1 ? '🏆 ' : ''}{item.name}</div><div style={{ fontSize: '11px', color: colors.muted }}>{item.item}</div></div>
                      <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'monospace', color: idx === 0 ? colors.success : colors.gold }}>${item.price.toFixed(0)}</div>
                    </div>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: '30px', color: colors.muted }}>🛒 Add shop quotes to compare</div>}
              </>
            )}

            {/* Map Sub-Tab */}
            {toolsSubTab === 'map' && (
              <>
                <div className="card" style={{background: 'linear-gradient(135deg, #ef444410, #ef444405)', border: '1px solid #ef444430' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444', marginBottom: '6px' }}>🗺️ Find Nearby Jewelry Shops</div>
                  <div style={{ fontSize: '11px', color: colors.muted, marginBottom: '12px' }}>
                    {mapLoaded ? 'Search for gold and jade dealers near you' : 'Loading map...'}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={mapSearchQuery}
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchNearbyJewelry()}
                      placeholder="Enter city, zipcode, or shop name..."
                      className="input"
                    />
                  </div>
                  <button
                    onClick={searchNearbyJewelry}
                    disabled={!mapLoaded || !map}
                    className="btn-gold" style={{width: '100%' }}
                  >
                    🔍 Search Nearby
                  </button>
                </div>

                {!mapLoaded ? (
                  <div className="card" style={{textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                    <div style={{ color: colors.muted }}>Loading Google Maps...</div>
                    <div style={{ fontSize: '10px', color: colors.muted, marginTop: '8px' }}>
                      Requires Google Maps API key
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      ref={mapContainerRef}
                      style={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: `1px solid ${colors.border}`,
                        marginBottom: '10px'
                      }}
                    />

                    {isSearching && (
                      <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                        <div className="spinner spinner-gold" style={{ margin: '0 auto 12px' }}></div>
                        <div style={{ fontSize: '12px', color: colors.muted }}>Searching nearby jewelry stores...</div>
                      </div>
                    )}

                    {!isSearching && searchResults.length > 0 && (
                      <div className="card">
                        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>🏪 Found {searchResults.length} shop{searchResults.length !== 1 ? 's' : ''}</span>
                          <span style={{ fontSize: '10px', color: colors.muted, fontWeight: 'normal' }}>In current view</span>
                        </div>

                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {searchResults.map((place, index) => (
                            <div
                              key={place.place_id}
                              onClick={() => centerOnPlace(place, index)}
                              style={{
                                padding: '12px',
                                marginBottom: '8px',
                                background: `${colors.gold}08`,
                                border: `1px solid ${colors.gold}30`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${colors.gold}15`;
                                e.currentTarget.style.borderColor = `${colors.gold}50`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = `${colors.gold}08`;
                                e.currentTarget.style.borderColor = `${colors.gold}30`;
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{
                                  minWidth: '24px',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: colors.gold,
                                  color: '#000',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  flexShrink: 0
                                }}>
                                  {index + 1}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: colors.text }}>
                                    {place.name}
                                  </div>
                                  <div style={{ fontSize: '11px', color: colors.muted, marginBottom: '6px' }}>
                                    📍 {place.vicinity}
                                  </div>

                                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {place.rating && (
                                      <div style={{ fontSize: '11px', color: colors.gold, fontWeight: '600' }}>
                                        ⭐ {place.rating}/5
                                        {place.user_ratings_total && (
                                          <span style={{ color: colors.muted, fontWeight: 'normal', marginLeft: '4px' }}>
                                            ({place.user_ratings_total})
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {place.price_level && (
                                      <div style={{ fontSize: '11px', color: colors.muted }}>
                                        {'$'.repeat(place.price_level)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isSearching && searchResults.length === 0 && markers.length === 0 && (
                      <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                        <div style={{ fontSize: '12px', color: colors.muted, marginBottom: '4px' }}>No results yet</div>
                        <div style={{ fontSize: '10px', color: colors.muted }}>Enter a city, zipcode, or click "Search Nearby"</div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ========== GLOSSARY TAB ========== */}
        {activeTab === 'glossary' && (
          <>
            <div className="card" style={{background: 'linear-gradient(135deg, #8b5cf610, #8b5cf605)', border: '1px solid #8b5cf630', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#8b5cf6', marginBottom: '6px' }}>📖 Jewelry Terms & Definitions</div>
              <div style={{ fontSize: '11px', color: colors.muted }}>Essential terminology for gold and jade valuation</div>
            </div>
            {glossary.map((item, idx) => (
              <div key={idx} className="card" style={{borderLeft: `3px solid ${idx % 2 === 0 ? colors.gold : colors.jade}` }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>{item.term}</div>
                <div style={{ fontSize: '12px', color: colors.muted, lineHeight: '1.5' }}>{item.definition}</div>
              </div>
            ))}
          </>
        )}

        {/* ========== GUIDE TAB ========== */}
        {activeTab === 'guide' && (
          <>
            <div className="card" style={{background: 'linear-gradient(135deg, #06b6d410, #06b6d405)', border: '1px solid #06b6d430', marginBottom: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#06b6d4', marginBottom: '8px' }}>📋 How to Use CalGeo</div>
              <div style={{ fontSize: '11px', color: colors.muted }}>Complete guide to jewelry valuation with CalGeo</div>
            </div>

            {/* Gold Calculator Guide */}
            <div className="card">
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gold, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🥇</span> Gold Calculator
              </div>
              <ol style={{ fontSize: '12px', color: colors.text, lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
                <li>Select your <strong>chain karat</strong> (24K, 18K, 14K, 10K)</li>
                <li>Choose the <strong>chain style</strong> (Cuban, Rope, Figaro, etc.)</li>
                <li>Pick <strong>metal type</strong> (Solid, White Gold, Two-Tone, etc.)</li>
                <li>Enter <strong>weight in grams</strong> (use jeweler's scale)</li>
                <li>Input the <strong>asking price</strong> from seller</li>
                <li>Optionally <strong>add a charm</strong> with separate specs</li>
                <li>Review <strong>melt value</strong> (minimum worth) and <strong>markup %</strong></li>
                <li style={{ color: colors.gold }}><strong>Pro/Expert:</strong> View negotiation targets (Aggressive, Fair, Max)</li>
              </ol>
            </div>

            {/* Jade Calculator Guide */}
            <div className="card">
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.jade, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💚</span> Jade Valuation
              </div>
              <ol style={{ fontSize: '12px', color: colors.text, lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
                <li>Select <strong>stone type</strong>: Jadeite (expensive) or Nephrite (common)</li>
                <li>Choose <strong>grade</strong>: Type A (natural), B (treated), C (dyed)</li>
                <li>Pick <strong>color</strong>: Imperial Green is most valuable</li>
                <li>Select <strong>translucency</strong>: Transparent is best</li>
                <li>Choose <strong>item type</strong> (Bangle, Pendant, Ring, etc.)</li>
                <li>Enter <strong>asking price</strong></li>
                <li>Review <strong>expected value range</strong> and <strong>red flags</strong></li>
                <li style={{ color: colors.jade }}><strong>Pro/Expert:</strong> Get counter-offer strategy</li>
              </ol>
            </div>

            {/* AI Scan Guide */}
            <div className="card">
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.scan, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📸</span> AI Image Scanning
              </div>
              <ol style={{ fontSize: '12px', color: colors.text, lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
                <li>Tap <strong>upload photo</strong> button</li>
                <li>Select clear image of jewelry (good lighting, close-up)</li>
                <li>Choose <strong>Auto</strong> (AI decides) or <strong>Guided</strong> (you specify)</li>
                <li>Tap <strong>Analyze</strong> - AI detects gold/jade type</li>
                <li>Review <strong>confidence score</strong> and detected specs</li>
                <li>Tap <strong>Apply & Calculate</strong> to auto-fill forms</li>
                <li style={{ color: colors.scan }}><strong>Limits:</strong> Free (3/month), Pro (50/month), Expert (unlimited)</li>
              </ol>
            </div>

            {/* Map Guide */}
            <div className="card">
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🗺️</span> Find Jewelry Shops
              </div>
              <ol style={{ fontSize: '12px', color: colors.text, lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
                <li>Navigate to <strong>Map tab</strong></li>
                <li><strong>Grant location access</strong> (or use default NYC)</li>
                <li>Search for specific terms: "gold dealers", "jade shops"</li>
                <li>Tap <strong>Search Nearby</strong> button</li>
                <li>Click <strong>gold diamond markers</strong> to view shop details</li>
                <li>Blue marker shows your current location</li>
                <li><strong>Search radius:</strong> 5km / 3 miles</li>
              </ol>
            </div>

            {/* Price Comparison Guide */}
            <div className="card">
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.list, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🛒</span> Price Comparison
              </div>
              <ol style={{ fontSize: '12px', color: colors.text, lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
                <li>Tap <strong>Add Shop Quote</strong></li>
                <li>Search business name with <strong>autocomplete</strong></li>
                <li>Enter <strong>item description</strong> and <strong>price</strong></li>
                <li>Repeat for multiple shops</li>
                <li>Best deal highlighted with <strong>🏆 trophy</strong></li>
                <li>All quotes sorted <strong>lowest to highest</strong></li>
                <li>Tap <strong>Remove</strong> to delete quotes</li>
              </ol>
            </div>

            {/* Tips & Best Practices */}
            <div className="card" style={{background: 'rgba(6,182,212,0.1)', border: '1px solid #06b6d440' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#06b6d4', marginBottom: '10px' }}>💡 Pro Tips</div>
              <ul style={{ fontSize: '12px', color: colors.text, lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
                <li><strong>Always weigh gold yourself</strong> - don't trust seller's scale</li>
                <li><strong>Check karat stamps</strong> - look for 24K, 18K, 14K markings</li>
                <li><strong>For jade:</strong> Type A natural jade holds value best</li>
                <li><strong>Use negotiation targets</strong> - start with Aggressive offer</li>
                <li><strong>Compare multiple shops</strong> - prices vary significantly</li>
                <li><strong>Bring portable scale</strong> - verify weight on-site</li>
                <li><strong>Check spot price daily</strong> - gold fluctuates constantly</li>
                <li><strong>Save calculations</strong> - use History tab for records</li>
              </ul>
            </div>

            {/* Upgrade CTA */}
            <div className="card" style={{background: `linear-gradient(135deg, ${colors.gold}15, ${colors.jade}15)`, border: `1px solid ${colors.gold}40`, textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💎</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: colors.gold, marginBottom: '8px' }}>Unlock Full Power</div>
              <div style={{ fontSize: '12px', color: colors.muted, marginBottom: '12px' }}>
                Upgrade to access negotiation targets, unlimited AI scans, and advanced features
              </div>
              <button onClick={() => setShowUpgrade(true)} className="btn-gold" style={{width: '100%', fontSize: '14px' }}>
                ⬆️ View Upgrade Options
              </button>
            </div>
          </>
        )}

        {/* FOOTER - LEGAL & BRANDING */}
        <div style={{ textAlign: 'center', padding: '16px 12px 20px', borderTop: `1px solid ${colors.border}`, marginTop: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: colors.gold, marginBottom: '8px' }}>
            A Marketsavage Product
          </div>
          <div style={{ fontSize: '9px', color: '#555', marginBottom: '12px' }}>
            CalGeo v1.2 • Powered by Gemini AI
          </div>

          {/* Legal Disclaimer */}
          <div style={{ fontSize: '8px', color: '#444', lineHeight: '1.4', maxWidth: '400px', margin: '0 auto 10px' }}>
            <strong style={{ color: '#666' }}>LEGAL DISCLAIMER:</strong> CalGeo provides jewelry valuation estimates for informational purposes only.
            All calculations, AI analyses, and price recommendations are approximations. Actual jewelry values may vary significantly.
            Users assume full responsibility for verifying jewelry authenticity and negotiating prices. Always consult certified appraisers for definitive valuations.
          </div>

          <div style={{ fontSize: '8px', color: '#555' }}>
            © 2025 Marketsavage. All rights reserved.
          </div>
        </div>
        </div>
      </main>

      {/* UPGRADE MODAL - Triggers Stripe Checkout */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setShowUpgrade(false)}>
          <div style={{ background: '#13131a', borderRadius: '18px', padding: '22px', maxWidth: '340px', width: '100%', border: `1px solid ${colors.gold}30` }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '32px' }}>💎</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: colors.gold }}>Upgrade CalGeo</div>
            </div>

            {/* Current Tier Display */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: colors.muted }}>Current Tier</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: userTier === 'expert' ? colors.gold : userTier === 'pro' ? '#3b82f6' : '#888', textTransform: 'uppercase' }}>{userTier}</div>
            </div>

            {/* Pro Tier */}
            <div
              onClick={() => { setShowUpgrade(false); initiateCheckout('pro', userId); }}
              style={{ background: 'rgba(59,130,246,0.1)', border: '2px solid #3b82f6', borderRadius: '12px', padding: '14px', marginBottom: '10px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#3b82f6', fontSize: '16px' }}>⭐ Pro</div>
                  <div style={{ fontSize: '10px', color: colors.muted }}>25 scans • History • Targets</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>$4.99<span style={{ fontSize: '11px' }}>/mo</span></div>
              </div>
            </div>

            {/* Expert Tier */}
            <div
              onClick={() => { setShowUpgrade(false); initiateCheckout('expert', userId); }}
              style={{ background: `${colors.gold}15`, border: `2px solid ${colors.gold}`, borderRadius: '12px', padding: '14px', marginBottom: '10px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: colors.gold, fontSize: '16px' }}>💎 Expert</div>
                  <div style={{ fontSize: '10px', color: colors.muted }}>Unlimited everything</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: colors.gold }}>$9.99<span style={{ fontSize: '11px' }}>/mo</span></div>
              </div>
            </div>

            <button onClick={() => setShowUpgrade(false)} className="btn-secondary" style={{width: '100%', marginTop: '6px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: colors.muted }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {showAbout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }} onClick={() => setShowAbout(false)}>
          <div style={{ background: '#13131a', borderRadius: '18px', padding: '22px', maxWidth: '500px', width: '100%', border: `1px solid ${colors.gold}30`, margin: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gold }}>ℹ️ About CalGeo</div>
              <button onClick={() => setShowAbout(false)} className="btn-secondary" style={{padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}` }}>✕</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>A Marketsavage Product</div>
              <div style={{ fontSize: '11px', color: colors.muted, lineHeight: '1.6' }}>
                CalGeo is a professional jewelry valuation tool for calculating fair market values for gold chains, charms, and jade jewelry.
                Features AI-powered image analysis, live gold spot prices, and an interactive map to find nearby jewelry shops.
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gold, marginBottom: '10px' }}>📚 Accredited Data Sources</div>
              <div style={{ fontSize: '11px', color: colors.muted, lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '2px' }}>Gold Spot Prices</div>
                  <div>Gold-API.com (London Bullion Market Association)</div>
                </div>
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '2px' }}>Jade Valuations</div>
                  <div>Gemological Institute of America (GIA) standards</div>
                </div>
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '2px' }}>Sales Tax Data</div>
                  <div>Tax Foundation & state revenue departments</div>
                </div>
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${colors.border}` }}>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '2px' }}>Location Services</div>
                  <div>Google Maps Platform & Places API</div>
                </div>
                <div>
                  <div style={{ color: colors.text, fontWeight: '600', marginBottom: '2px' }}>AI Analysis</div>
                  <div>Google Gemini Pro Vision</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#ef4444', marginBottom: '6px' }}>⚠️ Important Disclaimer</div>
              <div style={{ fontSize: '10px', color: colors.muted, lineHeight: '1.6' }}>
                CalGeo provides jewelry valuation estimates for informational purposes only. All calculations are approximations.
                Always verify authenticity with certified appraisers before making purchase decisions.
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>
              CalGeo v1.2 • © 2025 Marketsavage. All rights reserved.
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', overflowY: 'auto' }} onClick={() => setShowSettings(false)}>
          <div style={{ background: '#13131a', borderRadius: '18px', padding: '22px', maxWidth: '500px', width: '100%', border: `1px solid ${colors.gold}30`, margin: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gold }}>⚙️ Settings</div>
              <button onClick={() => setShowSettings(false)} className="btn-secondary" style={{padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}` }}>✕</button>
            </div>

            {/* THEME SELECTION */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '10px' }}>Display Mode</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setTheme('dark')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: theme === 'dark' ? `${colors.gold}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${theme === 'dark' ? colors.gold : colors.border}`,
                    color: theme === 'dark' ? colors.gold : colors.text,
                    fontWeight: theme === 'dark' ? '600' : '400'
                  }}
                >
                  🌙 Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: theme === 'light' ? `${colors.gold}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${theme === 'light' ? colors.gold : colors.border}`,
                    color: theme === 'light' ? colors.gold : colors.text,
                    fontWeight: theme === 'light' ? '600' : '400'
                  }}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: theme === 'system' ? `${colors.gold}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${theme === 'system' ? colors.gold : colors.border}`,
                    color: theme === 'system' ? colors.gold : colors.text,
                    fontWeight: theme === 'system' ? '600' : '400'
                  }}
                >
                  💻 System
                </button>
              </div>
              <div style={{ fontSize: '10px', color: colors.muted, marginTop: '6px' }}>
                {theme === 'system' ? 'Automatically matches your device settings' : `Always use ${theme} mode`}
              </div>
            </div>

            {/* STATE SELECTION */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '10px' }}>Sales Tax Location</div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="select"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  color: colors.text,
                  fontSize: '13px'
                }}
              >
                <option value="">No Sales Tax</option>
                {Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.name} ({data.rate.toFixed(2)}% tax)
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '10px', color: colors.muted, marginTop: '6px' }}>
                Select your state to include sales tax in calculations
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '20px' }}>
              CalGeo v1.2 • Settings saved automatically
            </div>
          </div>
        </div>
      )}

      {/* MENU DRAWER */}
      {showMenu && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100 }} onClick={() => setShowMenu(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '280px', background: '#0c0c12', borderLeft: `1px solid ${colors.gold}30`, padding: '20px', overflowY: 'auto', zIndex: 1101 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalGeoLogo size={28} />
                <span style={{ fontSize: '18px', fontWeight: '700', background: `linear-gradient(90deg, ${colors.gold}, #f4d03f)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Menu</span>
              </div>
              <button onClick={() => setShowMenu(false)} className="btn-secondary" style={{padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: colors.muted, textTransform: 'uppercase', fontWeight: '600', marginBottom: '10px' }}>Quick Actions</div>
              {[
                { label: '📋 How to Use Guide', action: () => { setActiveTab('guide'); setShowMenu(false); } },
                { label: '🔧 Tools', action: () => { setActiveTab('tools'); setShowMenu(false); } },
                { label: '🔄 Refresh Spot Price', action: () => { refreshSpotPrice(); setShowMenu(false); } },
                { label: '📖 View Glossary', action: () => { setActiveTab('glossary'); setShowMenu(false); } },
                { label: 'ℹ️ About & Sources', action: () => { setShowMenu(false); setShowAbout(true); } },
                { label: '💎 Upgrade Tier', action: () => { setShowMenu(false); setShowUpgrade(true); } },
                { label: '⚙️ Settings', action: () => { setShowMenu(false); setShowSettings(true); } }
              ].map((item, idx) => (
                <button key={idx} onClick={item.action} className="btn-secondary" style={{width: '100%', marginBottom: '8px', background: 'rgba(255,255,255,0.05)', color: colors.text, border: `1px solid ${colors.border}`, textAlign: 'left', fontSize: '13px' }}>{item.label}</button>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: colors.muted, textTransform: 'uppercase', fontWeight: '600', marginBottom: '10px' }}>Account</div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', border: `1px solid ${colors.border}` }}>
                {isLoggedIn && user && (
                  <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${colors.border}` }}>
                    <div style={{ fontSize: '11px', color: colors.gold, marginBottom: '4px', fontWeight: '600' }}>👤 {user.email}</div>
                    {username && <div style={{ fontSize: '10px', color: colors.muted }}>@{username}</div>}
                  </div>
                )}
                <div style={{ fontSize: '12px', color: colors.muted, marginBottom: '4px' }}>Current Tier</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: userTier === 'expert' ? colors.gold : userTier === 'pro' ? '#3b82f6' : '#888', textTransform: 'uppercase' }}>{userTier}</div>
                {userTier !== 'expert' && <div style={{ fontSize: '10px', color: colors.muted, marginTop: '6px' }}>{userTier === 'free' ? `${MAX_FREE_ANALYSES - analysisCount} scans remaining` : `${50 - analysisCount} scans remaining`}</div>}
              </div>
              {isLoggedIn ? (
                <button onClick={() => { handleLogout(); setShowMenu(false); }} className="btn-secondary" style={{width: '100%', marginTop: '8px', background: 'rgba(239,68,68,0.15)', color: colors.danger, border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px' }}>🚪 Logout</button>
              ) : (
                <button onClick={() => { setShowMenu(false); setShowAuthModal(true); }} className="btn-secondary" style={{width: '100%', marginTop: '8px', background: 'rgba(212,175,55,0.15)', color: colors.gold, border: `1px solid ${colors.gold}40`, fontSize: '12px' }}>🔐 Login</button>
              )}
            </div>

            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}>
              <div style={{ fontSize: '9px', color: '#555', textAlign: 'center', lineHeight: '1.4' }}>
                <div style={{ fontWeight: '600', color: colors.gold, marginBottom: '6px' }}>Marketsavage Product</div>
                <div>CalGeo v1.2</div>
                <div style={{ marginTop: '8px' }}>© 2025 Marketsavage</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIRST VISIT SPLASH - 20% OFF */}
      {showSplash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleSplashDismiss}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #1a1a28 0%, #0f0f18 100%)',
              borderRadius: '16px',
              width: '340px',
              border: `2px solid ${colors.gold}`,
              boxShadow: `0 0 40px ${colors.gold}30, 0 10px 30px rgba(0,0,0,0.5)`,
              padding: '32px 24px 24px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Offer Content */}
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: colors.gold,
                marginBottom: '8px',
              }}
            >
              Save 20%
            </div>
            <div style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>
              CalGeo Pro - First Month
            </div>
            <div style={{ fontSize: '18px', color: colors.muted, marginBottom: '24px' }}>
              <span style={{ textDecoration: 'line-through' }}>$4.99</span>
              <span style={{ fontSize: '24px', color: colors.gold, fontWeight: '700', marginLeft: '10px' }}>$3.99</span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleSplashCheckout}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${colors.gold} 0%, #c9a947 100%)`,
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                color: '#000',
                cursor: 'pointer',
                boxShadow: `0 4px 20px ${colors.gold}40`,
                marginBottom: '10px',
              }}
            >
              Save 20%
            </button>

            <button
              onClick={handleSplashDismiss}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                color: colors.muted,
                cursor: 'pointer',
              }}
            >
              No Thank You
            </button>
          </div>
        </div>
      )}

      {/* PAYWALL MODAL */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
        currentTier={userTier}
        scansRemaining={getScansRemaining(userTier, scanCount)}
        onUpgrade={(tier) => initiateCheckout(tier, user?.id || userId)}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        colors={colors}
      />
    </div>
  );
}
