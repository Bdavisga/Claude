'use client';

import Link from 'next/link';
import { InContentAd } from './AdSlot';

export default function BlogPost({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Split content to insert ad after first section
  const insertAdInContent = (content) => {
    // Find the first </p> or </h2> after a reasonable amount of content
    const splitPoint = content.indexOf('</h2>');
    if (splitPoint > 500) {
      const firstPart = content.substring(0, splitPoint + 5);
      const secondPart = content.substring(splitPoint + 5);
      return { firstPart, secondPart, hasAd: true };
    }
    return { firstPart: content, secondPart: '', hasAd: false };
  };

  const { firstPart, secondPart, hasAd } = insertAdInContent(post.content);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${post.slug}`
    : `/blog/${post.slug}`;

  return (
    <article className="blog-post">
      <Link href="/blog" className="back-to-blog">
        ← Back to Blog
      </Link>

      <header className="blog-post-header">
        <span className="blog-post-category">{post.category}</span>
        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-post-meta">
          <span>By {post.author}</span>
          <span>📅 {formatDate(post.date)}</span>
          <span>⏱️ {post.readTime}</span>
        </div>
      </header>

      <div className="blog-post-featured-image">
        {post.featuredImage ? (
          <img src={post.featuredImage} alt={post.title} />
        ) : (
          <span>📰</span>
        )}
      </div>

      <div className="blog-post-content">
        <div dangerouslySetInnerHTML={{ __html: firstPart }} />

        {hasAd && (
          <>
            <InContentAd />
            <div dangerouslySetInnerHTML={{ __html: secondPart }} />
          </>
        )}

        {!hasAd && secondPart && (
          <div dangerouslySetInnerHTML={{ __html: secondPart }} />
        )}
      </div>

      {/* Share Buttons */}
      <div className="share-buttons">
        <span className="share-label">Share this article:</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
          title="Share on X/Twitter"
        >
          𝕏
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
          title="Share on Facebook"
        >
          f
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button"
          title="Share on LinkedIn"
        >
          in
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied!');
          }}
          className="share-button"
          title="Copy link"
        >
          🔗
        </button>
      </div>

      {/* CTA to App */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#D4AF37', marginBottom: '12px', fontSize: '20px' }}>
          Ready to Value Your Gold?
        </h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Use CalGeo's free calculator with live spot prices
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          Open CalGeo Calculator →
        </Link>
      </div>
    </article>
  );
}
