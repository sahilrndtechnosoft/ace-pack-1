import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

export const dynamic = 'force-dynamic';

function safeParseJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');

    const db = getDbPool();
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_slug = c.slug
      WHERE 1=1
    `;
    const params: any[] = [];

    if (categorySlug && categorySlug !== 'all') {
      query += ' AND p.category_slug = ? ';
      params.push(categorySlug);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.product_slug LIKE ? OR p.capacity LIKE ? OR p.description LIKE ?) ';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY p.category_slug ASC, p.sort_order ASC, p.created_at ASC ';

    const [rows]: any = await db.query(query, params);

    const products = rows.map((r: any) => ({
      ...r,
      features: safeParseJson(r.features, []),
      dimensions: safeParseJson(r.dimensions, {}),
      applications: safeParseJson(r.applications, []),
      specs: safeParseJson(r.specs, []),
      varieties: safeParseJson(r.varieties, []),
    }));

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category_slug,
      product_slug,
      capacity,
      material,
      quality,
      packaging,
      image,
      blank_image,
      locking_food_image,
      description,
      features,
      dimensions,
      applications,
      specs,
      varieties,
      default_variety,
      sort_order,
      is_active,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    if (!category_slug?.trim()) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 });
    }

    const cleanSlug = (product_slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const db = getDbPool();

    // Verify category exists
    const [catRows]: any = await db.query('SELECT name FROM categories WHERE slug = ? LIMIT 1', [category_slug]);
    if (!catRows || catRows.length === 0) {
      return NextResponse.json({ error: `Category "${category_slug}" does not exist.` }, { status: 400 });
    }

    const id = `prod_${category_slug}_${cleanSlug}`;

    const [existing]: any = await db.query(
      'SELECT id FROM products WHERE category_slug = ? AND product_slug = ? LIMIT 1',
      [category_slug, cleanSlug]
    );
    if (existing && existing.length > 0) {
      return NextResponse.json({
        error: `Product with slug "${cleanSlug}" already exists in category "${category_slug}".`,
      }, { status: 400 });
    }

    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features || '[]';
    const dimensionsStr = typeof dimensions === 'object' ? JSON.stringify(dimensions) : dimensions || '{}';
    const applicationsStr = Array.isArray(applications) ? JSON.stringify(applications) : applications || '[]';
    const specsStr = Array.isArray(specs) ? JSON.stringify(specs) : specs || '[]';
    const varietiesStr = Array.isArray(varieties) ? JSON.stringify(varieties) : varieties || '[]';

    const [maxOrder]: any = await db.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM products WHERE category_slug = ?',
      [category_slug]
    );
    const order = sort_order !== undefined ? Number(sort_order) : maxOrder[0]?.next_order || 0;

    await db.query(
      `INSERT INTO products (
        id, category_slug, product_slug, name, capacity, material, quality, packaging,
        image, blank_image, locking_food_image, description, features, dimensions,
        applications, specs, varieties, default_variety, sort_order, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        category_slug,
        cleanSlug,
        name.trim(),
        capacity || '',
        material || 'Virgin PP 05 Food Grade',
        quality || 'Export Grade Food Safe',
        packaging || '',
        image || '/images/hero-bg-image.jpg',
        blank_image || null,
        locking_food_image || null,
        description || null,
        featuresStr,
        dimensionsStr,
        applicationsStr,
        specsStr,
        varietiesStr,
        default_variety || null,
        order,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ]
    );

    await logActivity(admin.email, 'CREATE_PRODUCT', 'PRODUCT', id, {
      name,
      category_slug,
      product_slug: cleanSlug,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/products');
      revalidatePath('/categories');
      revalidatePath(`/categories/${category_slug}`);
      revalidatePath(`/categories/${category_slug}/${cleanSlug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Product created successfully.',
      productId: id,
      product_slug: cleanSlug,
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      category_slug,
      product_slug,
      capacity,
      material,
      quality,
      packaging,
      image,
      blank_image,
      locking_food_image,
      description,
      features,
      dimensions,
      applications,
      specs,
      varieties,
      default_variety,
      sort_order,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const currentProd = rows[0];

    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features;
    const dimensionsStr = typeof dimensions === 'object' ? JSON.stringify(dimensions) : dimensions;
    const applicationsStr = Array.isArray(applications) ? JSON.stringify(applications) : applications;
    const specsStr = Array.isArray(specs) ? JSON.stringify(specs) : specs;
    const varietiesStr = Array.isArray(varieties) ? JSON.stringify(varieties) : varieties;

    await db.query(
      `UPDATE products SET
        name = COALESCE(?, name),
        category_slug = COALESCE(?, category_slug),
        product_slug = COALESCE(?, product_slug),
        capacity = COALESCE(?, capacity),
        material = COALESCE(?, material),
        quality = COALESCE(?, quality),
        packaging = COALESCE(?, packaging),
        image = COALESCE(?, image),
        blank_image = COALESCE(?, blank_image),
        locking_food_image = COALESCE(?, locking_food_image),
        description = COALESCE(?, description),
        features = COALESCE(?, features),
        dimensions = COALESCE(?, dimensions),
        applications = COALESCE(?, applications),
        specs = COALESCE(?, specs),
        varieties = COALESCE(?, varieties),
        default_variety = COALESCE(?, default_variety),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = NOW()
       WHERE id = ?`,
      [
        name?.trim() || null,
        category_slug || null,
        product_slug || null,
        capacity !== undefined ? capacity : null,
        material !== undefined ? material : null,
        quality !== undefined ? quality : null,
        packaging !== undefined ? packaging : null,
        image || null,
        blank_image !== undefined ? blank_image : null,
        locking_food_image !== undefined ? locking_food_image : null,
        description !== undefined ? description : null,
        featuresStr || null,
        dimensionsStr || null,
        applicationsStr || null,
        specsStr || null,
        varietiesStr || null,
        default_variety !== undefined ? default_variety : null,
        sort_order !== undefined ? Number(sort_order) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id,
      ]
    );

    await logActivity(admin.email, 'UPDATE_PRODUCT', 'PRODUCT', id, {
      name,
      category_slug: category_slug || currentProd.category_slug,
      product_slug: product_slug || currentProd.product_slug,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/products');
      revalidatePath('/categories');
      revalidatePath(`/categories/${category_slug || currentProd.category_slug}`);
      revalidatePath(`/categories/${category_slug || currentProd.category_slug}/${product_slug || currentProd.product_slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT id, name, category_slug, product_slug FROM products WHERE id = ? LIMIT 1',
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const prod = rows[0];
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    await logActivity(admin.email, 'DELETE_PRODUCT', 'PRODUCT', id, {
      name: prod.name,
      category_slug: prod.category_slug,
      product_slug: prod.product_slug,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/products');
      revalidatePath('/categories');
      revalidatePath(`/categories/${prod.category_slug}`);
      revalidatePath(`/categories/${prod.category_slug}/${prod.product_slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
