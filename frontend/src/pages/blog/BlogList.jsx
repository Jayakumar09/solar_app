import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { BlogCard, BlogCardSkeleton, BlogSidebar, blogCategories, formatDate } from './components/blogComponents';

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    loadBlogs(1);
    loadRecentPosts();
  }, []);

  const loadBlogs = async (page) => {
    setLoading(true);
    try {
      const data = await blogService.getAll(page, 9);
      setBlogs(Array.isArray(data?.blogs) ? data.blogs : []);
      setPagination({
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,
        total: data?.total || 0
      });
    } catch (error) {
      console.error('Error loading blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPosts = async () => {
    try {
      const data = await blogService.getRecent(3);
      setRecentPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading recent posts:', error);
      setRecentPosts([]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadBlogs(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/blog/category/${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Solar Energy Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert insights on solar energy, renewable power, and sustainable living. 
            Stay informed with the latest in solar technology and savings tips.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(blogCategories || []).map(cat => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-all"
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {blogs.map(blog => (
                  <BlogCard
                    key={blog.id}
                    post={blog}
                    onClick={(slug) => navigate(`/blog/${slug}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-2 text-center py-16">
                <div className="text-6xl mb-4">☀️</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No blogs found</h2>
                <p className="text-gray-600">Check back soon for new content!</p>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <BlogSidebar categories={blogCategories} recentPosts={recentPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
export { BlogCard, BlogCardSkeleton, BlogSidebar, blogCategories, formatDate };