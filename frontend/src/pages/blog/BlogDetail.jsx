import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { BlogSidebar, formatDate } from './components/blogComponents';

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBySlug(slug);
      if (data) {
        setBlog(data);
        generateTOC(data.content);
        updateMetaTags(data);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      console.error('Error loading blog:', err);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const generateTOC = (content) => {
    if (!content) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    const toc = [];
    headings.forEach((heading, index) => {
      toc.push({
        id: `heading-${index}`,
        text: heading.textContent,
        level: heading.tagName
      });
    });
    setTableOfContents(toc);
  };

  const updateMetaTags = (blog) => {
    if (!blog) return;
    document.title = blog.meta_title || blog.title;
    
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    desc.content = blog.meta_description || '';
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This blog article is not available.'}</p>
          <button 
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="relative h-80 lg:h-96">
                <img 
                  src={blog.featured_image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80'} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <span className="inline-block bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                    {blog.category}
                  </span>
                  <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight">
                    {blog.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold">G</span>
                    </div>
                    <span className="font-medium text-gray-800">{blog.author}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span>{formatDate(blog.created_at)}</span>
                  <span className="text-gray-300">|</span>
                  <span>{blog.view_count || 0} views</span>
                </div>

                <div 
                  className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags && blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 p-6 bg-gradient-to-br from-primary-50 to-amber-50 rounded-xl">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Ready to Start Your Solar Journey?</h3>
                  <p className="text-gray-600 mb-4">
                    Get a free consultation and customized quote for your property.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => navigate('/quote-request')}
                      className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600"
                    >
                      Get Free Quote
                    </button>
                    <button 
                      onClick={() => navigate('/solar-calculator')}
                      className="px-6 py-2.5 border border-primary-500 text-primary-600 font-medium rounded-lg hover:bg-primary-50"
                    >
                      Calculate Savings
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-primary-600 font-medium hover:underline"
                  >
                    ← Back to Blog
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <FAQItem 
                  question="How much do solar panels cost in India?"
                  answer="Solar panel costs in India range from ₹45,000-70,000 per kW for residential systems. A 5kW system typically costs ₹2.25-3 lakhs before subsidies."
                />
                <FAQItem 
                  question="How long does solar panel installation take?"
                  answer="The entire process typically takes 2-4 weeks from inquiry to activation, including net metering approval."
                />
                <FAQItem 
                  question="Do solar panels work during cloudy weather?"
                  answer="Yes, solar panels can still generate electricity on cloudy days, though at reduced efficiency (about 10-25% of normal output)."
                />
                <FAQItem 
                  question="What is the lifespan of solar panels?"
                  answer="Solar panels typically come with 25-year warranties and can last 30+ years with proper maintenance."
                />
              </div>
            </div>
          </article>

          <aside className="lg:col-span-1">
            {tableOfContents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
                <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.id)}
                      className={`block text-left text-sm transition-colors ${
                        item.level === 'H3' ? 'pl-4 text-gray-500' : 'text-gray-700 hover:text-primary-600'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}
            
            <div className="mt-6">
              <BlogSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }) => (
  <details className="group">
    <summary className="flex items-center justify-between cursor-pointer list-none">
      <span className="font-medium text-gray-800">{question}</span>
      <span className="ml-2 flex-shrink-0 transition-transform group-open:rotate-180">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </summary>
    <p className="mt-2 text-gray-600 text-sm">{answer}</p>
  </details>
);

export default BlogDetail;