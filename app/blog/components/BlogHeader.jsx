import Link from 'next/link';

export default function BlogHeader() {
  return (
    <header className="blog-header">
      <div className="blog-header-inner">
        <Link href="/" className="blog-header-logo">
          <span>CalGeo</span>
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: '400',
            marginLeft: '8px'
          }}>
            Blog
          </span>
        </Link>

        <nav className="blog-header-nav">
          <Link href="/blog" className="blog-header-link">
            All Posts
          </Link>
          <Link href="/" className="blog-header-cta">
            Open App
          </Link>
        </nav>
      </div>
    </header>
  );
}
