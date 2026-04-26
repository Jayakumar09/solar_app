import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogCard, BlogCardSkeleton, BlogSidebar, blogCategories } from './components/blogComponents';

const API_ENDPOINT = 'https://solar-app-5l4i.onrender.com/api/blogs?limit=100';

const normalize = (s = '') =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

const extractCandidates = (post = {}) => {
  const out = [];

  const add = (v) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach(add);
      return;
    }
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (!trimmed) return;
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          parsed.forEach(add);
          return;
        }
      } catch (e) {
        // not JSON
      }
      out.push(trimmed);
    } else {
      out.push(String(v));
    }
  };

  add(post.category);
  add(post.category_slug || post.categorySlug || post.categorySlug);
  add(post.categoryName);
  add(post.slug);

  return [...new Set(out.map(normalize).filter(Boolean))];
};

const CategoryPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchedCount, setMatchedCount] = useState(0);
  const controllerRef = useRef(null);

  const rawSlug = window.location.pathname.split('/').filter(Boolean).pop() || '';
  const slug = normalize(rawSlug);

  useEffect(() => {
    controllerRef.current?.abort?.();
    const ac = new AbortController();
    controllerRef.current = ac;
    let mounted = true;

    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINT, { signal: ac.signal });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        const all = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
          ? data.blogs
          : [];

        console.log('slug:', rawSlug);
        console.log('fetched total:', Array.isArray(all) ? all.length : 0);
        console.log('categories (sample):', all.slice(0, 10).map(p => p.category));

        const matched = all.filter((post) => {
          const candidates = extractCandidates(post);
          return candidates.includes(slug);
        });

        if (!mounted) return;
        setBlogs(matched);
        setMatchedCount(matched.length);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching blogs:', err);
        if (mounted) {
          setBlogs([]);
          setMatchedCount(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAndFilter();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [rawSlug]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{(blogCategories.find(c => normalize(c.slug) === slug)?.icon) || '📄'}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            { (blogCategories.find(c => normalize(c.slug) === slug)?.name) || (rawSlug ? rawSlug.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Category') } Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse articles in this category.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(blogCategories || []).map(cat => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/blog/category/${cat.slug}`)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                normalize(cat.slug) === slug
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg shadow-sm bg-white animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded mb-1 w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6">
                  Showing {matchedCount} article{matchedCount !== 1 ? 's' : ''} in {(blogCategories.find(c => normalize(c.slug) === slug)?.name) || rawSlug.replace(/-/g,' ')}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {blogs.map(blog => (
                    <BlogCard
                      key={blog.id || blog.slug}
                      post={blog}
                      onClick={(s) => navigate(`/blog/${s}`)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="col-span-2 text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No articles yet</h2>
                <p className="text-gray-600">Check back soon for new content in this category.</p>
              </div>
            )}
          </main>

          <aside className="lg:col-span-1">
            <BlogSidebar categories={blogCategories} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
