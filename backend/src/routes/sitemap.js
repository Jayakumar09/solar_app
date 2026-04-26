import express from 'express';
import * as Blog from '../models/blog.js';
import { query } from '../config/database.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://greenhybridpower.in';
    
    const staticPages = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.8 },
      { loc: '/services', changefreq: 'monthly', priority: 0.8 },
      { loc: '/vision', changefreq: 'monthly', priority: 0.7 },
      { loc: '/why-choose-us', changefreq: 'monthly', priority: 0.7 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.8 },
      { loc: '/faq', changefreq: 'monthly', priority: 0.7 },
      { loc: '/testimonials', changefreq: 'weekly', priority: 0.7 },
      { loc: '/book-inspection', changefreq: 'monthly', priority: 0.8 },
      { loc: '/quote-request', changefreq: 'monthly', priority: 0.9 },
      { loc: '/solar-calculator', changefreq: 'monthly', priority: 0.9 },
      { loc: '/blog', changefreq: 'daily', priority: 0.9 }
    ];

    let blogUrls = [];
    try {
      const result = await query(
        'SELECT slug, created_at FROM blogs WHERE status = $1 ORDER BY created_at DESC LIMIT 100',
        ['published']
      );
      blogUrls = result.rows.map(blog => ({
        loc: `/blog/${blog.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: blog.created_at
      }));
    } catch (err) {
      console.log('Could not fetch blogs for sitemap:', err.message);
    }

    const categoryUrls = [
      '/blog/category/solar-guide',
      '/blog/category/solar-cost',
      '/blog/category/government-subsidy',
      '/blog/category/solar-maintenance',
      '/blog/category/solar-comparison',
      '/blog/category/renewable-energy-news'
    ].map(loc => ({ loc, changefreq: 'weekly', priority: 0.8 }));

    const allUrls = [...staticPages, ...blogUrls, ...categoryUrls];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const robotsTxt = `# Robots.txt for Green Hybrid Power
# https://greenhybridpower.in

User-agent: *
Allow: /

Sitemap: https://greenhybridpower.in/api/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /vendor/
Disallow: /client/

# Sitemap includes blog
Sitemap: https://greenhybridpower.in/api/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export default router;