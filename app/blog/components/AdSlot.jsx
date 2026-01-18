'use client';

import React, { useEffect, useRef } from 'react';

// AdSense-ready ad slot component
const AD_CLIENT_ID = 'ca-pub-1897097068256252';

export default function AdSlot({
  slot = 'XXXXXXXXXX', // Ad unit ID
  format = 'auto', // auto, horizontal, vertical, rectangle
  className = '',
  style = {}
}) {
  const adRef = useRef(null);
  const isProduction = process.env.NODE_ENV === 'production';

  // Ad format dimensions
  const formatStyles = {
    leaderboard: { width: '728px', height: '90px', maxWidth: '100%' },
    rectangle: { width: '300px', height: '250px' },
    vertical: { width: '160px', height: '600px' },
    auto: { width: '100%', minHeight: '100px' },
    'in-article': { width: '100%', minHeight: '250px' }
  };

  const dimensions = formatStyles[format] || formatStyles.auto;

  useEffect(() => {
    // Only load ads in production
    if (isProduction) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [isProduction]);

  // Development placeholder (shows ad slot visually during dev)
  if (!isProduction) {
    return (
      <div
        className={`ad-slot ad-${format} ${className}`}
        style={{
          ...dimensions,
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
          border: '2px dashed rgba(212, 175, 55, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(212, 175, 55, 0.6)',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          margin: '20px auto',
          ...style
        }}
      >
        <span>Ad Space ({format})</span>
      </div>
    );
  }

  // Production AdSense code
  return (
    <div className={`ad-slot ad-${format} ${className}`} style={{ margin: '20px auto', textAlign: 'center', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...dimensions }}
        data-ad-client={AD_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
      />
    </div>
  );
}

// Preset ad components for common placements
export function HeaderAd({ className }) {
  return <AdSlot format="leaderboard" className={className} />;
}

export function SidebarAd({ className }) {
  return <AdSlot format="rectangle" className={className} />;
}

export function InContentAd({ className }) {
  return <AdSlot format="in-article" className={className} />;
}

export function FooterAd({ className }) {
  return <AdSlot format="leaderboard" className={className} />;
}
