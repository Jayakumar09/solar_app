import * as Blog from '../models/blog.js';

const trendingTopics = [
  { title: "Solar Panel Cost in Delhi 2026", category: "Solar Cost", keywords: ["solar delhi", "solar price delhi", "delhi solar"] },
  { title: "Best Solar Company Near Me", category: "Solar Guide", keywords: ["best solar company", "solar installer near me"] },
  { title: "Solar Subsidy Documents Required 2026", category: "Government Subsidy", keywords: ["solar subsidy documents", "solar documents"] },
  { title: "Rooftop Solar vs Ground Mounted Solar", category: "Solar Comparison", keywords: ["rooftop vs ground solar", "solar installation types"] },
  { title: "Solar Maintenance Tips for Monsoon", category: "Solar Maintenance", keywords: ["solar monsoon", "rainy season solar"] },
  { title: "Green Energy Goals India 2026", category: "Renewable Energy News", keywords: ["india renewable", "india green energy"] },
  { title: "Commercial Solar ROI Calculator", category: "Solar Cost", keywords: ["commercial solar roi", "solar returns"] },
  { title: "Solar Panel Cleaning Guide", category: "Solar Maintenance", keywords: ["clean solar panels", "solar cleaning"] },
  { title: "Solar Under Cloudy Conditions", category: "Solar Guide", keywords: ["cloudy weather solar", "low light solar"] },
  { title: "Hybrid vs On-Grid Solar System", category: "Solar Comparison", keywords: ["hybrid vs on-grid", "solar system comparison"] }
];

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

const generateBlogContent = (topic) => {
  return `
<h1>${topic.title}</h1>

<p>Looking for the best ${topic.keywords[0]} solutions? You've come to the right place. This comprehensive guide will help you understand everything you need to know about ${topic.title.toLowerCase()}.</p>

<h2>What You Need to Know</h2>
<p>Understanding ${topic.title.toLowerCase()} is essential for making informed decisions about your solar investment. Whether you're a homeowner or business owner, having the right information can save you thousands of rupees.</p>

<h2>Key Benefits</h2>
<ul>
<li>Significant reduction in electricity bills</li>
<li>Environmental sustainability</li>
<li>Government incentives and subsidies</li>
<li>Long-term cost savings</li>
<li>Increased property value</li>
</ul>

<h2>How It Works</h2>
<p>The process of getting started with solar is straightforward. Our team of experts will guide you through every step, from initial consultation to installation and beyond.</p>

<h3>Step 1: Consultation</h3>
<p>Contact us for a free assessment of your property's solar potential.</p>

<h3>Step 2: Custom Design</h3>
<p>We design a system tailored to your specific energy needs.</p>

<h3>Step 3: Professional Installation</h3>
<p>Our certified team installs your system with minimal disruption.</p>

<h3>Step 4: Activation</h3>
<p>Your system is connected to the grid and activated.</p>

<h2>Frequently Asked Questions</h2>

<h3>How much does it cost?</h3>
<p>Costs vary based on system size and your specific requirements. Contact us for a customized quote.</p>

<h3>How long does installation take?</h3>
<p>Most residential installations are completed within 3-5 days.</p>

<h3>What maintenance is required?</h3>
<p>Minimal maintenance is needed - mostly periodic cleaning and annual inspections.</p>

<h3>Is it worth the investment?</h3>
<p>Yes! Most systems pay for themselves within 4-6 years through electricity savings.</p>

<h2>Conclusion</h2>
<p>Investing in solar energy is one of the best decisions you can make for your home or business. With government support, falling prices, and proven technology, now is the perfect time to go solar.</p>

<div class="cta-box">
<h3>Ready to Get Started?</h3>
<p>Get a free consultation and customized quote for your property.</p>
<a href="https://greenhybridpower.in/quote-request" class="cta-button">Get Free Quote</a>
</div>
`;
};

const generateMetaTitle = (topic) => {
  return `${topic.title} | Green Hybrid Power`;
};

const generateMetaDescription = (topic) => {
  return `Learn about ${topic.title.toLowerCase()}. Expert guide covering benefits, costs, and installation process. Get free quote from India's trusted solar provider.`;
};

const generateBlog = async (topic) => {
  const slug = generateSlug(topic.title);
  
  const blogData = {
    title: topic.title,
    slug: slug,
    content: generateBlogContent(topic),
    meta_title: generateMetaTitle(topic),
    meta_description: generateMetaDescription(topic),
    category: topic.category,
    tags: topic.keywords,
    author: 'Green Hybrid Power',
    featured_image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80'
  };
  
  return blogData;
};

export async function autoGenerateBlogs() {
  console.log('Starting auto-blog generation...');
  
  const numToGenerate = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...trendingTopics].sort(() => 0.5 - Math.random());
  const selectedTopics = shuffled.slice(0, numToGenerate);
  
  for (const topic of selectedTopics) {
    try {
      const blogData = await generateBlog(topic);
      await Blog.createBlog(blogData);
      console.log(`✓ Auto-generated: ${blogData.title}`);
    } catch (err) {
      if (err.message.includes('duplicate') || err.code === '23505') {
        console.log(`- Skipped (exists): ${topic.title}`);
      } else {
        console.error(`Error generating blog: ${err.message}`);
      }
    }
  }
  
  console.log('Auto-blog generation complete!');
}

export async function runScheduledBlogGeneration() {
  console.log('Running scheduled blog generation...');
  await autoGenerateBlogs();
}

if (process.argv[1] === import.meta.url || process.argv[1].includes('generateBlogs')) {
  autoGenerateBlogs().catch(console.error);
}