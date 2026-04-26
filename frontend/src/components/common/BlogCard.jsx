import React from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

export default function BlogCard({ post, onClick }) {
  if (!post) return null;

  const handleError = (e) => {
    const img = e.currentTarget;
    if (img.dataset.errored) return;
    img.dataset.errored = '1';
    img.src = FALLBACK_IMAGE;
  };

  return (
    <article
      onClick={() => onClick && onClick(post.slug)}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.featured_image || FALLBACK_IMAGE}
          alt={post.title || 'Blog image'}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {post.category && (
          <span className="absolute top-4 left-4 bg-primary-500/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h2 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h2>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.meta_description || post.excerpt || ''}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(post.created_at)}</span>
          <span className="text-amber-500 font-medium">Read more →</span>
        </div>
      </div>
    </article>
  );
}
