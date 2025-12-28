// ============================================================
// CALGEO PAYWALL SYSTEM - Drop into CalGeo.jsx
// Copy this entire file and integrate into your component
// ============================================================

// ==================== TIER CONFIG ====================
const TIER_CONFIG = {
  free: {
    name: 'Free',
    badge: '',
    scanLimit: 2,           // TOTAL lifetime
    historyLimit: 0,
    shoppingLimit: 0,
    refreshLimit: 1,        // Per session
    jadeColors: ['apple_green', 'light_green', 'white_ice'],
    features: [],
  },
  pro: {
    name: 'Pro',
    badge: '⭐',
    price: 4.99,
    scanLimit: 25,          // Per month
    historyLimit: 50,
    shoppingLimit: 10,
    refreshLimit: -1,       // Unlimited
    jadeColors: 'all',
    features: [
      'charm_combo',
      'all_jade_colors',
      'negotiation_targets',
      'melt_breakdown',
      'detailed_grades',
      'history',
      'shopping_list',
      'unlimited_refresh',
    ],
  },
  expert: {
    name: 'Expert',
    badge: '💎',
    price: 9.99,
    scanLimit: -1,          // Unlimited
    historyLimit: -1,
    shoppingLimit: -1,
    refreshLimit: -1,
    jadeColors: 'all',
    features: [
      'charm_combo',
      'all_jade_colors',
      'negotiation_targets',
      'melt_breakdown',
      'detailed_grades',
      'history',
      'shopping_list',
      'unlimited_refresh',
      'unlimited_scans',
      'google_places',
      'unlimited_history',
      'price_alerts',
      'batch_calculate',
    ],
  },
};

// ==================== PAYWALL MESSAGES ====================
const PAYWALL_COPY = {
  charm_combo: {
    icon: '⛓️',
    title: 'Chain + Charm Calculator',
    hook: 'Calculate combos for accurate total value',
    benefit: 'Pro users save avg $47 per combo purchase',
    cta: 'Unlock Combo Calculator',
  },
  negotiation_targets: {
    icon: '🎯',
    title: 'Negotiation Targets',
    hook: 'Know exactly what price to offer',
    benefit: 'Get Aggressive, Fair, and Max prices instantly',
    cta: 'See What to Offer',
  },
  melt_breakdown: {
    icon: '📊',
    title: 'Melt Value Breakdown',
    hook: 'See the real gold value vs markup',
    benefit: 'Never overpay for labor again',
    cta: 'Unlock Breakdown',
  },
  detailed_grades: {
    icon: '🏆',
    title: 'Smart Grading System',
    hook: '5-tier grading: STEAL → OVERPAY',
    benefit: 'Make confident buying decisions',
    cta: 'Unlock Smart Grades',
  },
  history: {
    icon: '📜',
    title: 'Calculation History',
    hook: 'Track all your calculations',
    benefit: 'Never lose a quote - compare over time',
    cta: 'Start Tracking',
  },
  shopping_list: {
    icon: '🛒',
    title: 'Price Comparison',
    hook: 'Compare prices across shops',
    benefit: 'Find the best deal instantly',
    cta: 'Compare Prices',
  },
  all_jade_colors: {
    icon: '💚',
    title: 'All Jade Colors',
    hook: 'Unlock Imperial Green, Lavender & more',
    benefit: 'Value any jade piece accurately',
    cta: 'Unlock All Colors',
  },
  ai_scan: {
    icon: '📸',
    title: 'AI Image Analysis',
    hook: 'Snap a photo, get instant ID',
    benefit: 'Identify karat, style & value in seconds',
    cta: 'Get More Scans',
  },
  google_places: {
    icon: '📍',
    title: 'Shop Lookup',
    hook: 'Search real jewelry shops',
    benefit: 'Ratings, reviews & addresses',
    cta: 'Unlock Shop Search',
  },
  unlimited_refresh: {
    icon: '🔄',
    title: 'Live Spot Prices',
    hook: 'Real-time gold price updates',
    benefit: 'Always have the latest prices',
    cta: 'Get Live Prices',
  },
};

// ==================== PAYWALL COMPONENT ====================
const PaywallModal = ({
  isOpen,
  onClose,
  feature,
  currentTier,
  onUpgrade,
  scansRemaining
}) => {
  if (!isOpen) return null;

  const copy = PAYWALL_COPY[feature] || {
    icon: '🔒',
    title: 'Premium Feature',
    hook: 'Unlock this feature with Pro',
    benefit: 'Get the most out of CalGeo',
    cta: 'Upgrade Now',
  };

  const isOutOfScans = feature === 'ai_scan' && scansRemaining <= 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(180deg, #1a1a24 0%, #0d0d12 100%)',
        borderRadius: '24px 24px 0 0',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        maxHeight: '70vh',
        border: '1px solid rgba(212,175,55,0.3)',
        borderBottom: 'none',
      }} onClick={e => e.stopPropagation()}>

        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{copy.icon}</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>{copy.title}</div>
        </div>

        {/* Hook */}
        <div style={{
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: '#e5e5e5', marginBottom: '6px' }}>{copy.hook}</div>
          <div style={{ fontSize: '12px', color: '#d4af37', fontWeight: '600' }}>✨ {copy.benefit}</div>
        </div>

        {/* Out of scans warning */}
        {isOutOfScans && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '13px', color: '#ef4444' }}>
              ⚠️ You've used all {TIER_CONFIG.free.scanLimit} free scans
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div style={{ marginBottom: '16px' }}>
          {/* Pro Card */}
          <div
            onClick={() => onUpgrade('pro')}
            style={{
              background: 'rgba(59,130,246,0.1)',
              border: '2px solid #3b82f6',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '10px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '14px',
              background: '#3b82f6',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '10px',
            }}>MOST POPULAR</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#3b82f6', fontSize: '16px' }}>⭐ Pro</div>
                <div style={{ fontSize: '11px', color: '#888' }}>25 scans • History • Targets</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#3b82f6' }}>$4.99</div>
                <div style={{ fontSize: '10px', color: '#666' }}>/month</div>
              </div>
            </div>
          </div>

          {/* Expert Card */}
          <div
            onClick={() => onUpgrade('expert')}
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: '14px',
              padding: '14px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#d4af37', fontSize: '16px' }}>💎 Expert</div>
                <div style={{ fontSize: '11px', color: '#888' }}>Unlimited everything</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#d4af37' }}>$9.99</div>
                <div style={{ fontSize: '10px', color: '#666' }}>/month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trial Badge */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '20px',
          }}>🎁 3-day free trial included</span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#666',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

// ==================== LOCKED FEATURE OVERLAY ====================
const LockedOverlay = ({ feature, onClick, blur = true, children }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        filter: blur ? 'blur(4px)' : 'none',
        opacity: blur ? 0.6 : 1,
        pointerEvents: 'none'
      }}>
        {children}
      </div>
      <div
        onClick={onClick}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '12px',
          cursor: 'pointer',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔒</div>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#d4af37',
          background: 'rgba(212,175,55,0.2)',
          padding: '4px 12px',
          borderRadius: '20px',
        }}>
          Unlock with Pro
        </div>
      </div>
    </div>
  );
};

// ==================== SCAN COUNTER BADGE ====================
const ScanCounter = ({ remaining, total, tier }) => {
  if (tier === 'expert') return null; // Don't show for unlimited

  const isLow = remaining <= 1;
  const isEmpty = remaining <= 0;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      background: isEmpty ? 'rgba(239,68,68,0.15)' : isLow ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)',
      border: `1px solid ${isEmpty ? 'rgba(239,68,68,0.3)' : isLow ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      color: isEmpty ? '#ef4444' : isLow ? '#f59e0b' : '#888',
    }}>
      <span>📸</span>
      <span>{remaining}/{total === -1 ? '∞' : total}</span>
      {isEmpty && <span>scans</span>}
    </div>
  );
};

// ==================== HELPER FUNCTIONS ====================
const hasFeature = (tier, feature) => {
  return TIER_CONFIG[tier]?.features?.includes(feature) || false;
};

const canUseScan = (tier, scanCount) => {
  const limit = TIER_CONFIG[tier]?.scanLimit;
  if (limit === -1) return true;
  return scanCount < limit;
};

const getScansRemaining = (tier, scanCount) => {
  const limit = TIER_CONFIG[tier]?.scanLimit;
  if (limit === -1) return '∞';
  return Math.max(0, limit - scanCount);
};

const isJadeColorLocked = (tier, colorValue) => {
  const allowedColors = TIER_CONFIG[tier]?.jadeColors;
  if (allowedColors === 'all') return false;
  return !allowedColors.includes(colorValue);
};

// ==================== STRIPE CHECKOUT ====================
const initiateCheckout = async (tier, userId) => {
  try {
    console.log('Initiating checkout for:', tier, userId);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, userId }),
    });

    console.log('Checkout response status:', res.status);

    if (res.ok) {
      const data = await res.json();
      console.log('Checkout response data:', data);

      if (data.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No URL in response:', data);
        alert('Error: No checkout URL received');
      }
    } else {
      const error = await res.json();
      console.error('Checkout failed:', error);
      alert('Checkout failed: ' + (error.error || 'Unknown error'));
    }
  } catch (e) {
    console.error('Checkout error:', e);
    alert('Upgrade error: ' + e.message);
  }
};

// ==================== EXPORTS ====================
export {
  TIER_CONFIG,
  PAYWALL_COPY,
  PaywallModal,
  LockedOverlay,
  ScanCounter,
  hasFeature,
  canUseScan,
  getScansRemaining,
  isJadeColorLocked,
  initiateCheckout,
};
