const blogCategories = [
  { name: 'Solar Guide', slug: 'solar-guide', icon: '☀️' },
  { name: 'Solar Cost', slug: 'solar-cost', icon: '💰' },
  { name: 'Government Subsidy', slug: 'government-subsidy', icon: '🏛️' },
  { name: 'Solar Maintenance', slug: 'solar-maintenance', icon: '🔧' },
  { name: 'Solar Comparison', slug: 'solar-comparison', icon: '⚖️' },
  { name: 'Renewable Energy News', slug: 'renewable-energy-news', icon: '📰' }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BlogCard = ({ post, onClick }) => {
  if (!post) return null;
  return (
    <article 
      onClick={() => onClick(post.slug)}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.featured_image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute top-4 left-4 bg-primary-500/90 text-white text-xs font-medium px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      
      <div className="p-5">
        <h2 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h2>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.meta_description || post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(post.created_at)}</span>
          <span className="text-amber-500 font-medium">Read more →</span>
        </div>
      </div>
    </article>
  );
};

const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const BlogSidebar = ({ categories, recentPosts = [] }) => {
  const navigate = (path) => window.location.href = path;
  
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Categories
        </h3>
        <div className="space-y-2">
          {blogCategories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/blog/category/${cat.slug}`)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Recent Posts
        </h3>
        <div className="space-y-4">
          {Array.isArray(recentPosts) && recentPosts.length > 0 ? recentPosts.map(post => (
            <div 
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="flex gap-3 cursor-pointer group"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={post.featured_image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80'} 
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{formatDate(post.created_at)}</p>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 text-sm">No recent posts</p>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 text-white">
        <h3 className="font-bold text-lg mb-2">Ready to Go Solar?</h3>
        <p className="text-primary-100 text-sm mb-4">
          Get a free consultation and customized quote for your property.
        </p>
        <button 
          onClick={() => navigate('/quote-request')}
          className="w-full bg-white text-primary-600 font-semibold py-2.5 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Get Free Quote
        </button>
      </div>
    </aside>
  );
};

export { BlogCard, BlogCardSkeleton, BlogSidebar, blogCategories, formatDate };
export default blogCategories;