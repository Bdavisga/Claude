import "./globals.css";
import "./styles/calgeo-design-system.css";
import { Analytics } from '@vercel/analytics/next';

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
  },
  manifest: '/manifest.json',
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
