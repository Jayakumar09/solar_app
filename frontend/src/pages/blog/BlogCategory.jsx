import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { BlogCard, BlogCardSkeleton, BlogSidebar, blogCategories, formatDate } from './components/blogComponents';

const BlogCategory = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    if (category) {
      loadCategoryBlogs(1);
    }
  }, [category]);

  const loadCategoryBlogs = async (page) => {
    setLoading(true);
    try {
      const data = await blogService.getByCategory(category, page, 9);
      setBlogs(Array.isArray(data?.blogs) ? data.blogs : []);
      setPagination({
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,
        total: data?.total || 0
      });
      
      const catInfo = blogCategories.find(c => c.slug === category);
      setCategoryInfo(catInfo || { name: category, icon: '📄' });
    } catch (error) {
      console.error('Error loading category blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadCategoryBlogs(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categoryDescriptions = {
    'solar-guide': 'Learn everything about solar energy systems, from basics to advanced topics.',
    'solar-cost': 'Understand solar pricing, financing options, and return on investment.',
    'government-subsidy': 'Discover government incentives, subsidies, and tax benefits available.',
    'solar-maintenance': 'Tips and guides for maintaining your solar system for optimal performance.',
    'solar-comparison': 'Compare different solar options to make informed decisions.',
    'renewable-energy-news': 'Stay updated with the latest news and developments in renewable energy.'
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">{categoryInfo?.icon || '📄'}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {categoryInfo?.name || category} Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categoryDescriptions[category] || `Browse our ${category} articles and resources.`}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(blogCategories || []).map(cat => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/blog/category/${cat.slug}`)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat.slug === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
              }`}
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
              <>
                <p className="text-gray-600 mb-6">
                  Showing {Array.isArray(blogs) ? blogs.length : 0} article{pagination.total > 1 ? 's' : ''} in {categoryInfo?.name}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {Array.isArray(blogs) && blogs.map(blog => (
                    <BlogCard
                      key={blog.id}
                      post={blog}
                      onClick={(slug) => navigate(`/blog/${slug}`)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="col-span-2 text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No articles yet</h2>
                <p className="text-gray-600">Check back soon for new content in this category!</p>
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
            <BlogSidebar categories={blogCategories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCategory;