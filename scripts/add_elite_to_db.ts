// Adds the Elite Containers line (built from the live site, lib/data/elite-containers.ts) to the
// admin's categories/products tables. Insert-only: existing rows and admin edits are never touched.
// Run: npx tsx --env-file=.env scripts/add_elite_to_db.ts
import mysql from 'mysql2/promise';
import { eliteContainers as cat } from '../lib/data/elite-containers';

async function main() {
  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'acepack_cms',
  });
  try {
    // mysql2 reports "1 affected row" even for no-op duplicates, so count real rows before/after.
    const count = async (sql: string) => ((await db.query(sql, [cat.slug])) as any)[0][0].n as number;
    const catsBefore = await count('SELECT COUNT(*) AS n FROM categories WHERE slug = ?');
    const prodsBefore = await count('SELECT COUNT(*) AS n FROM products WHERE category_slug = ?');
    const [[{ next }]] = (await db.query('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM categories')) as any;
    await db.query(
      `INSERT INTO categories (id, slug, name, subtitle_name, short_description, description,
         hero_image, features, gallery, faqs, sort_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE id = id`,
      [cat.id, cat.slug, cat.name, cat.subtitleName, cat.shortDescription, cat.description, cat.heroImage,
       JSON.stringify(cat.features), JSON.stringify(cat.gallery ?? []), JSON.stringify(cat.faqs ?? []), next]
    );
    for (const [i, p] of cat.products.entries()) {
      await db.query(
        `INSERT INTO products (id, category_slug, product_slug, name, capacity, material, quality, packaging,
           image, blank_image, locking_food_image, description, features, dimensions, applications, specs,
           varieties, default_variety, sort_order, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', NULL, ?, 1, NOW(), NOW())
         ON DUPLICATE KEY UPDATE id = id`,
        [p.id, cat.slug, p.product_slug, p.name, p.capacity, p.material, p.quality, p.packaging ?? '',
         p.image, p.blankImage ?? null, p.lockingFoodImage ?? null, p.description ?? null,
         JSON.stringify(p.features), JSON.stringify(p.dimensions ?? {}), JSON.stringify(p.applications ?? []),
         JSON.stringify(p.specs ?? []), i]
      );
    }
    const catsAdded = (await count('SELECT COUNT(*) AS n FROM categories WHERE slug = ?')) - catsBefore;
    const prodsAdded = (await count('SELECT COUNT(*) AS n FROM products WHERE category_slug = ?')) - prodsBefore;
    console.log(`${cat.name}: category ${catsAdded ? 'added' : 'already present'}, products added ${prodsAdded}, already present ${cat.products.length - prodsAdded}`);
  } finally {
    await db.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
