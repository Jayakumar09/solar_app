import { query } from '../config/database.js';

export const createBlogTable = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      meta_title VARCHAR(500),
      meta_description TEXT,
      category VARCHAR(100) NOT NULL,
      tags TEXT[] DEFAULT '{}',
      author VARCHAR(255) DEFAULT 'Green Hybrid Power',
      featured_image VARCHAR(1000),
      status VARCHAR(20) DEFAULT 'published',
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
    CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
    CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
    CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
  `;
  
  await query(createTableSQL);
  console.log('✓ Blogs table created/verified');
};

export const getAllBlogs = async (options = {}) => {
  const { page = 1, limit = 10, category, status = 'published' } = options;
  const offset = (page - 1) * limit;
  
  let whereClause = 'WHERE status = $1';
  const params = [status];
  
  if (category) {
    whereClause += ' AND category = $2';
    params.push(category);
  }
  
  const countResult = await query(
    `SELECT COUNT(*) FROM blogs ${whereClause}`,
    params
  );
  
  const result = await query(
    `SELECT id, title, slug, content, meta_title, meta_description, category, tags, author, 
            featured_image, status, view_count, created_at, updated_at
     FROM blogs ${whereClause} 
     ORDER BY created_at DESC 
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  
  return {
    blogs: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
};

export const getBlogBySlug = async (slug) => {
  const result = await query(
    `SELECT * FROM blogs WHERE slug = $1 AND status = 'published'`,
    [slug]
  );
  
  if (result.rows.length > 0) {
    await query(
      'UPDATE blogs SET view_count = view_count + 1 WHERE id = $1',
      [result.rows[0].id]
    );
  }
  
  return result.rows[0];
};

export const getBlogsByCategory = async (category, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const countResult = await query(
    'SELECT COUNT(*) FROM blogs WHERE category = $1 AND status = $2',
    [category, 'published']
  );
  
  const result = await query(
    `SELECT id, title, slug, content, meta_title, meta_description, category, tags, author, 
            featured_image, view_count, created_at
     FROM blogs 
     WHERE category = $1 AND status = $2
     ORDER BY created_at DESC 
     LIMIT $3 OFFSET $4`,
    [category, 'published', limit, offset]
  );
  
  return {
    blogs: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
};

export const createBlog = async (blogData) => {
  const { title, slug, content, meta_title, meta_description, category, tags, author, featured_image } = blogData;
  
  const result = await query(
    `INSERT INTO blogs (title, slug, content, meta_title, meta_description, category, tags, author, featured_image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [title, slug, content, meta_title || title, meta_description, category, tags || [], author || 'Green Hybrid Power', featured_image]
  );
  
  return result.rows[0];
};

export const updateBlog = async (id, blogData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  for (const [key, value] of Object.entries(blogData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }
  
  if (fields.length === 0) return null;
  
  values.push(id);
  
  const result = await query(
    `UPDATE blogs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount} RETURNING *`,
    values
  );
  
  return result.rows[0];
};

export const deleteBlog = async (id) => {
  const result = await query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

export const getAllCategories = async () => {
  const result = await query(
    `SELECT category, COUNT(*) as count 
     FROM blogs WHERE status = 'published'
     GROUP BY category 
     ORDER BY count DESC`
  );
  return result.rows;
};

export const getRecentBlogs = async (limit = 5) => {
  const result = await query(
    `SELECT id, title, slug, category, featured_image, created_at
     FROM blogs WHERE status = 'published'
     ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getPopularBlogs = async (limit = 5) => {
  const result = await query(
    `SELECT id, title, slug, category, featured_image, view_count
     FROM blogs WHERE status = 'published'
     ORDER BY view_count DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
};