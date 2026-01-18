import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog-posts';
import BlogPost from '../components/BlogPost';
import BlogCard from '../components/BlogCard';
import { HeaderAd, MobileHeaderAd, SidebarAd, FooterAd } from '../components/AdSlot';
import Link from 'next/link';

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.featuredImage ? [post.featuredImage] : ['/calgeo-logo-512.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);
  const allPosts = getAllPosts().slice(0, 5);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'CalGeo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://calgeo.app/calgeo-logo-512.png',
      },
    },
    image: post.featuredImage || 'https://calgeo.app/calgeo-logo-512.png',
  };

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="blog-content-wrapper">
        {/* Header Ads - Desktop leaderboard, Mobile responsive */}
        <HeaderAd />
        <MobileHeaderAd />

        <div className="blog-layout">
          {/* Main Content */}
          <main>
            <BlogPost post={post} />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="related-posts">
                <h2 className="related-posts-title">Related Articles</h2>
                <div className="related-posts-grid">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Ad Slot */}
            <SidebarAd />

            {/* More Posts */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">More Articles</h3>
              {allPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="sidebar-post">
                  {p.title}
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

        {/* Footer Ad */}
        <FooterAd />
      </div>
    </>
  );
}
