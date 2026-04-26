import React, { useEffect, useState } from 'react';
import { blogService } from '../services/blogService';

const BlogSeoHead = ({ blog }) => {
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    setCanonicalUrl(window.location.href);
  }, []);

  if (!blog) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.meta_description || blog.excerpt,
    "image": blog.featured_image || 'https://greenhybridpower.in/assets/og-image.jpg',
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "author": {
      "@type": "Organization",
      "name": blog.author || "Green Hybrid Power"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Green Hybrid Power",
      "logo": {
        "@type": "ImageObject",
        "url": "https://greenhybridpower.in/logo.png"
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much do solar panels cost in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Solar panel costs in India range from ₹45,000-70,000 per kW for residential systems. A 5kW system typically costs ₹2.25-3 lakhs before subsidies."
        }
      },
      {
        "@type": "Question",
        "name": "How long does solar panel installation take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The entire process typically takes 2-4 weeks from inquiry to activation, including net metering approval."
        }
      },
      {
        "@type": "Question",
        "name": "Do solar panels work during cloudy weather?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, solar panels can still generate electricity on cloudy days, though at reduced efficiency."
        }
      },
      {
        "@type": "Question",
        "name": "What is the lifespan of solar panels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Solar panels typically come with 25-year warranties and can last 30+ years with proper maintenance."
        }
      }
    ]
  };

  return (
    <>
      <title>{blog.meta_title || blog.title}</title>
      <meta name="description" content={blog.meta_description || ''} />
      <meta property="og:title" content={blog.meta_title || blog.title} />
      <meta property="og:description" content={blog.meta_description || ''} />
      <meta property="og:image" content={blog.featured_image || 'https://greenhybridpower.in/assets/og-image.jpg'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={blog.created_at} />
      <meta property="article:modified_time" content={blog.updated_at || blog.created_at} />
      <meta property="article:author" content={blog.author || 'Green Hybrid Power'} />
      <meta property="article:section" content={blog.category} />
      {blog.tags && blog.tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={blog.meta_title || blog.title} />
      <meta name="twitter:description" content={blog.meta_description || ''} />
      <meta name="twitter:image" content={blog.featured_image || 'https://greenhybridpower.in/assets/og-image.jpg'} />
      <link rel="canonical" href={canonicalUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
};

const BlogListSeoHead = ({ title = 'Solar Energy Blog', description = 'Expert insights on solar energy, renewable power, and sustainable living in India.' }) => {
  return (
    <>
      <title>{title} | Green Hybrid Power</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${title} | Green Hybrid Power`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${title} | Green Hybrid Power`} />
      <meta name="twitter:description" content={description} />
    </>
  );
};

export { BlogSeoHead, BlogListSeoHead };
export default BlogSeoHead;