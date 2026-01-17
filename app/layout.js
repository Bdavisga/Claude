import "./globals.css";
import "./styles/calgeo-design-system.css";
import Script from "next/script";

export const metadata = {
  title: "CalGeo - Jewelry Valuation App",
  description: "Professional jewelry valuation for gold, silver, and jade",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CalGeo',
    startupImage: [
      // iPhone SE, iPod touch 7th gen
      { url: '/splash/apple-splash-640x1136.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' },
      // iPhone 8, 7, 6s, 6
      { url: '/splash/apple-splash-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
      // iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus
      { url: '/splash/apple-splash-1242x2208.png', media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone X, XS, 11 Pro, 12 mini, 13 mini
      { url: '/splash/apple-splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone XR, 11
      { url: '/splash/apple-splash-828x1792.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)' },
      // iPhone XS Max, 11 Pro Max
      { url: '/splash/apple-splash-1242x2688.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 12, 12 Pro, 13, 13 Pro, 14
      { url: '/splash/apple-splash-1170x2532.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
      { url: '/splash/apple-splash-1284x2778.png', media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 14 Pro
      { url: '/splash/apple-splash-1179x2556.png', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 14 Pro Max, 15 Plus, 15 Pro Max
      { url: '/splash/apple-splash-1290x2796.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'CalGeo',
    'apple-mobile-web-app-title': 'CalGeo',
    'theme-color': '#0a0a0a',
    'msapplication-TileColor': '#0a0a0a',
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('CalGeo SW registered:', registration.scope);
                  },
                  function(err) {
                    console.log('CalGeo SW registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
