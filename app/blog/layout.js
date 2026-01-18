import Script from 'next/script';
import BlogHeader from './components/BlogHeader';
import './blog.css';
import '../styles/calgeo-design-system.css';

export const metadata = {
  metadataBase: new URL('https://calgeo.vercel.app'),
  title: {
    template: '%s | CalGeo Blog',
    default: 'CalGeo Blog - Gold & Jewelry Valuation Tips',
  },
  description: 'Expert guides on gold valuation, jewelry authentication, and precious metals investing. Learn how to value your jewelry with live market prices.',
  keywords: ['gold valuation', 'jewelry worth', 'gold karat', 'sell gold', 'gold price', 'jewelry authentication'],
  openGraph: {
    type: 'website',
    siteName: 'CalGeo Blog',
    images: ['/calgeo-logo-512.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function BlogLayout({ children }) {
  return (
    <div className="blog-container">
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1897097068256252"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <BlogHeader />
      {children}
    </div>
  );
}
