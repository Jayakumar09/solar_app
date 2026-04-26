import { useEffect } from 'react';

const DEFAULT_DESC = 'Helpful solar guides, subsidy updates, pricing, maintenance, and renewable energy news.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80';

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (selector.startsWith('meta[name=')) {
      const name = selector.match(/meta\[name=['"]?(.*?)['"]?\]/)[1];
      el.setAttribute('name', name);
    } else if (selector.startsWith('meta[property=')) {
      const prop = selector.match(/meta\[property=['"]?(.*?)['"]?\]/)[1];
      el.setAttribute('property', prop);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function SEO({ title = '', description = DEFAULT_DESC, image = DEFAULT_IMAGE }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Green Hybrid Power Solutions` : 'Green Hybrid Power Solutions';
    document.title = fullTitle;

    // description
    setMeta("meta[name='description']", 'content', description);

    // Open Graph
    setMeta("meta[property='og:title']", 'content', fullTitle);
    setMeta("meta[property='og:description']", 'content', description);
    setMeta("meta[property='og:image']", 'content', image);

    // Twitter
    setMeta("meta[name='twitter:card']", 'content', 'summary_large_image');
    setMeta("meta[name='twitter:title']", 'content', fullTitle);
    setMeta("meta[name='twitter:description']", 'content', description);
    setMeta("meta[name='twitter:image']", 'content', image);
  }, [title, description, image]);

  return null;
}
