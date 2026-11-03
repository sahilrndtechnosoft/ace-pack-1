import mysql from 'mysql2/promise';
import { seedDatabase } from './seed';

let pool: mysql.Pool | null = null;
let initialized = false;

export function getDbPool(): mysql.Pool {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'vihaa@rnd',
    database: process.env.MYSQL_DATABASE || 'acepack_cms',
    waitForConnections: true,
    connectionLimit: 15,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8mb4',
  });

  return pool;
}

export async function initDb(): Promise<void> {
  if (initialized) return;

  const db = getDbPool();

  // Create tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(191) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
      reset_token VARCHAR(255),
      reset_token_expires_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token VARCHAR(255) PRIMARY KEY,
      admin_id VARCHAR(191) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_admin_id (admin_id),
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS pages (
      id VARCHAR(191) PRIMARY KEY,
      slug VARCHAR(191) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      seo_title VARCHAR(255),
      seo_description TEXT,
      og_image VARCHAR(500),
      canonical_url VARCHAR(500),
      robots_index TINYINT(1) DEFAULT 1,
      is_published TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS sections (
      id VARCHAR(191) PRIMARY KEY,
      page_slug VARCHAR(191) NOT NULL,
      section_key VARCHAR(191) NOT NULL,
      title VARCHAR(255),
      subtitle VARCHAR(255),
      draft_content LONGTEXT NOT NULL,
      published_content LONGTEXT NOT NULL,
      is_enabled TINYINT(1) DEFAULT 1,
      is_published TINYINT(1) DEFAULT 1,
      sort_order INT DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_page_section (page_slug, section_key),
      INDEX idx_page_slug (page_slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(191) PRIMARY KEY,
      slug VARCHAR(191) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      summary TEXT NOT NULL,
      content LONGTEXT NOT NULL,
      takeaways TEXT,
      tags TEXT,
      image VARCHAR(500) NOT NULL,
      author_name VARCHAR(150) NOT NULL,
      author_role VARCHAR(150) NOT NULL,
      author_avatar VARCHAR(500) NOT NULL,
      read_time VARCHAR(50) NOT NULL,
      date VARCHAR(50) NOT NULL,
      is_published TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_blog_slug (slug),
      INDEX idx_blog_published (is_published)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(191) PRIMARY KEY,
      slug VARCHAR(191) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc LONGTEXT,
      date VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      booth VARCHAR(100),
      image VARCHAR(500) NOT NULL,
      gallery LONGTEXT,
      category VARCHAR(100),
      is_featured TINYINT(1) DEFAULT 0,
      is_published TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_event_slug (slug),
      INDEX idx_event_published (is_published)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS downloads (
      id VARCHAR(191) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      format VARCHAR(50) NOT NULL,
      file_size VARCHAR(50) NOT NULL,
      download_url VARCHAR(500) NOT NULL,
      cover_image VARCHAR(500),
      sort_order INT DEFAULT 0,
      is_published TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_download_sort (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS media (
      id VARCHAR(191) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size BIGINT NOT NULL,
      url VARCHAR(500) NOT NULL,
      alt_text VARCHAR(255),
      category VARCHAR(100) NOT NULL DEFAULT 'general',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_media_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value LONGTEXT NOT NULL,
      setting_type VARCHAR(50) DEFAULT 'string',
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(191) PRIMARY KEY,
      slug VARCHAR(191) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      subtitle_name VARCHAR(255),
      short_description TEXT,
      description LONGTEXT,
      hero_image VARCHAR(500),
      features LONGTEXT,
      gallery LONGTEXT,
      faqs LONGTEXT,
      sort_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cat_slug (slug),
      INDEX idx_cat_order (sort_order ASC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(191) PRIMARY KEY,
      category_slug VARCHAR(191) NOT NULL,
      product_slug VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      capacity VARCHAR(100),
      material VARCHAR(150),
      quality VARCHAR(150),
      packaging VARCHAR(150),
      image VARCHAR(500),
      blank_image VARCHAR(500),
      locking_food_image VARCHAR(500),
      description LONGTEXT,
      features LONGTEXT,
      dimensions LONGTEXT,
      applications LONGTEXT,
      specs LONGTEXT,
      varieties LONGTEXT,
      default_variety VARCHAR(100),
      sort_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_cat_prod (category_slug, product_slug),
      INDEX idx_prod_cat (category_slug),
      INDEX idx_prod_slug (product_slug),
      INDEX idx_prod_order (sort_order ASC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id VARCHAR(191) PRIMARY KEY,
      admin_email VARCHAR(255) NOT NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id VARCHAR(191),
      details LONGTEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_act_created (created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Check if admin exists; if not, seed complete initial website data
  const [rows]: any = await db.query('SELECT count(*) as count FROM admins');
  if (rows && rows[0] && rows[0].count === 0) {
    console.log('[CMS MySQL] Seeding initial database tables and website content...');
    await seedDatabase(db);
    console.log('[CMS MySQL] Initial database seed completed!');
  }

  initialized = true;
}

export async function logActivity(
  adminEmail: string,
  action: string,
  entityType: string,
  entityId?: string | null,
  details?: Record<string, any> | string | null
): Promise<void> {
  try {
    const db = getDbPool();
    const id = 'act_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details || '';
    await db.query(
      `INSERT INTO activity_logs (id, admin_email, action, entity_type, entity_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [id, adminEmail, action, entityType, entityId || null, detailsStr]
    );
  } catch (err) {
    console.error('Failed to log admin activity in MySQL:', err);
  }
}
