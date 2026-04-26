import React, { useEffect, useState } from 'react';

const API = 'https://solar-app-5l4i.onrender.com/api/blogs?limit=5';
const FALLBACK = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

const imgError = (e) => {
  const img = e.currentTarget;
  if (img.dataset.errored) return;
  img.dataset.errored = '1';
  img.src = FALLBACK;
};

export default function RecentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
          ? data.blogs
          : [];
        setPosts(list.slice(0, 5));
      })
      .catch((err) => {
        console.error('RecentPosts fetch error', err);
        if (mounted) setError(err);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading recent posts...</p>;
  if (error) return <p className="text-sm text-red-500">Unable to load posts right now.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <a
          key={post.id || post.slug}
          href={`/blog/${post.slug}`}
          className="flex gap-3 items-center group"
        >
          <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={post.featured_image || FALLBACK}
              alt={post.title}
              loading="lazy"
              decoding="async"
              onError={imgError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {post.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">{formatDate(post.created_at)}</p>
          </div>
        </a>
      ))}
      {posts.length === 0 && <p className="text-sm text-gray-500">No recent posts</p>}
    </div>
  );
}
