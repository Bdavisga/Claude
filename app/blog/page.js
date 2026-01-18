import { getAllPosts } from '@/lib/blog-posts';
import BlogCard from './components/BlogCard';
import { HeaderAd, MobileHeaderAd, SidebarAd } from './components/AdSlot';
import Link from 'next/link';

export const metadata = {
  title: 'Blog - Gold & Jewelry Valuation Guides',
  description: 'Learn how to value gold jewelry, understand karats, spot fake gold, and get the best prices. Expert guides from CalGeo.',
  openGraph: {
    title: 'CalGeo Blog - Gold & Jewelry Valuation Guides',
    description: 'Expert guides on gold valuation, jewelry authentication, and precious metals.',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="blog-content-wrapper">
      {/* Header Ads - Desktop leaderboard, Mobile responsive */}
      <HeaderAd />
      <MobileHeaderAd />

      <div className="blog-layout">
        {/* Main Content */}
        <main>
          <h1 className="blog-title">CalGeo Blog</h1>
          <p className="blog-subtitle">
            Expert guides on gold valuation, jewelry authentication, and precious metals
          </p>

          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* Ad Slot */}
          <SidebarAd />

          {/* Popular Posts */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Popular Posts</h3>
            {posts.slice(0, 5).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="sidebar-post">
                {post.title}
              </Link>
            ))}
          </div>

          {/* CTA Box */}
          <div className="sidebar-section" style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            textAlign: 'center'
          }}>
            <h3 className="sidebar-title" style={{ marginBottom: '8px' }}>
              Value Your Gold
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Free calculator with live prices
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)',
                color: '#000',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Open CalGeo →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
