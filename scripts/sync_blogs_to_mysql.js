const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function syncBlogs() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'vihaa@rnd',
    database: process.env.MYSQL_DATABASE || 'acepack_cms',
  });

  console.log('Connected to MySQL acepack_cms.');

  const [cols] = await conn.query('DESCRIBE blogs');
  const existingCols = new Set(cols.map((c) => c.Field));
  const newCols = [
    ['content_html', 'LONGTEXT'],
    ['meta_title', 'VARCHAR(255)'],
    ['meta_description', 'TEXT'],
    ['canonical', 'VARCHAR(500)'],
    ['views', 'VARCHAR(50)'],
  ];

  for (const [col, type] of newCols) {
    if (!existingCols.has(col)) {
      console.log('Adding column:', col);
      await conn.query(`ALTER TABLE blogs ADD COLUMN ${col} ${type}`);
    } else {
      console.log('Column exists:', col);
    }
  }

  const blogsPath = path.resolve(__dirname, '../lib/data/acepack-all-blogs.json');
  const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
  console.log('Total blogs to sync to MySQL:', blogs.length);

  for (const post of blogs) {
    const blogId = 'blog_' + post.slug;
    await conn.query(
      `INSERT INTO blogs (id, slug, title, category, summary, content, content_html, meta_title, meta_description, canonical, views, takeaways, tags, image, author_name, author_role, author_avatar, read_time, date, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE 
         title=VALUES(title), 
         category=VALUES(category),
         summary=VALUES(summary), 
         content=VALUES(content), 
         content_html=VALUES(content_html),
         meta_title=VALUES(meta_title),
         meta_description=VALUES(meta_description),
         canonical=VALUES(canonical),
         views=VALUES(views),
         image=VALUES(image),
         date=VALUES(date),
         updated_at=NOW()`,
      [
        blogId,
        post.slug,
        post.title,
        post.category || 'Industry Trends',
        post.summary || '',
        JSON.stringify(post.content || []),
        post.content_html || null,
        post.meta_title || null,
        post.meta_description || null,
        post.canonical || null,
        post.views || null,
        JSON.stringify(post.takeaways || []),
        JSON.stringify(post.tags || []),
        post.image || '/images/hero-bg-image.jpg',
        post.author?.name || 'Ace Editorial Team',
        post.author?.role || 'Packaging Technology Specialist',
        post.author?.avatar || '/images/hero-bg-image.jpg',
        post.readTime || '5 min read',
        post.date || 'October 2026',
      ]
    );
  }

  const [count] = await conn.query('SELECT count(*) as count FROM blogs');
  console.log('MySQL blogs count after sync:', count[0].count);

  await conn.end();
}

syncBlogs().catch((err) => {
  console.error('Error syncing blogs:', err);
  process.exit(1);
});
