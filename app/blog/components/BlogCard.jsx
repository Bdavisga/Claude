import Link from 'next/link';

export default function BlogCard({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-image">
        {post.featuredImage ? (
          <img src={post.featuredImage} alt={post.title} />
        ) : (
          <span>📰</span>
        )}
      </div>
      <div className="blog-card-content">
        <span className="blog-card-category">{post.category}</span>
        <h2 className="blog-card-title">{post.title}</h2>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-meta">
          <span>📅 {formatDate(post.date)}</span>
          <span>⏱️ {post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
