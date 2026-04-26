import express from 'express';
import * as Blog from '../models/blog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const result = await Blog.getAllBlogs({
      page: parseInt(page),
      limit: parseInt(limit),
      category
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.getBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await Blog.getBlogsByCategory(
      req.params.category,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const blogs = await Blog.getRecentBlogs(parseInt(limit));
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const blogs = await Blog.getPopularBlogs(parseInt(limit));
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.createBlog(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.updateBlog(req.params.id, req.body);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;