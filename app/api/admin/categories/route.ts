import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const db = getDbPool();
    let query = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.slug = p.category_slug
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ' AND (c.name LIKE ? OR c.slug LIKE ? OR c.description LIKE ?) ';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' GROUP BY c.id ORDER BY c.sort_order ASC, c.created_at ASC ';

    const [rows]: any = await db.query(query, params);

    const categories = rows.map((r: any) => ({
      ...r,
      features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : r.features || [],
      gallery: typeof r.gallery === 'string' ? JSON.parse(r.gallery || '[]') : r.gallery || [],
      faqs: typeof r.faqs === 'string' ? JSON.parse(r.faqs || '[]') : r.faqs || [],
      product_count: Number(r.product_count || 0),
    }));

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
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
      slug,
      subtitle_name,
      short_description,
      description,
      hero_image,
      features,
      gallery,
      faqs,
      sort_order,
      is_active,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const id = 'cat_' + cleanSlug;
    const db = getDbPool();

    const [existing]: any = await db.query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [cleanSlug]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: `Category with slug "${cleanSlug}" already exists.` }, { status: 400 });
    }

    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features || '[]';
    const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : gallery || '[]';
    const faqsStr = Array.isArray(faqs) ? JSON.stringify(faqs) : faqs || '[]';

    const [maxOrder]: any = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM categories');
    const order = sort_order !== undefined ? Number(sort_order) : maxOrder[0]?.next_order || 0;

    await db.query(
      `INSERT INTO categories (
        id, slug, name, subtitle_name, short_description, description,
        hero_image, features, gallery, faqs, sort_order, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        cleanSlug,
        name.trim(),
        subtitle_name || '',
        short_description || '',
        description || '',
        hero_image || '/images/hero-bg-image.jpg',
        featuresStr,
        galleryStr,
        faqsStr,
        order,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ]
    );

    await logActivity(admin.email, 'CREATE_CATEGORY', 'CATEGORY', id, { name, slug: cleanSlug });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/categories');
      revalidatePath(`/categories/${cleanSlug}`);
      revalidatePath('/products');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Category created successfully.',
      categoryId: id,
      slug: cleanSlug,
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category.' }, { status: 500 });
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
      slug,
      name,
      subtitle_name,
      short_description,
      description,
      hero_image,
      features,
      gallery,
      faqs,
      sort_order,
      is_active,
    } = body;

    if (!id && !slug) {
      return NextResponse.json({ error: 'Category ID or slug is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT id, slug FROM categories WHERE id = ? OR slug = ? LIMIT 1',
      [id || '', slug || '']
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    const currentCat = rows[0];
    const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features;
    const galleryStr = Array.isArray(gallery) ? JSON.stringify(gallery) : gallery;
    const faqsStr = Array.isArray(faqs) ? JSON.stringify(faqs) : faqs;

    await db.query(
      `UPDATE categories SET
        name = COALESCE(?, name),
        subtitle_name = COALESCE(?, subtitle_name),
        short_description = COALESCE(?, short_description),
        description = COALESCE(?, description),
        hero_image = COALESCE(?, hero_image),
        features = COALESCE(?, features),
        gallery = COALESCE(?, gallery),
        faqs = COALESCE(?, faqs),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = NOW()
       WHERE id = ?`,
      [
        name?.trim() || null,
        subtitle_name !== undefined ? subtitle_name : null,
        short_description !== undefined ? short_description : null,
        description !== undefined ? description : null,
        hero_image || null,
        featuresStr || null,
        galleryStr || null,
        faqsStr || null,
        sort_order !== undefined ? Number(sort_order) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        currentCat.id,
      ]
    );

    await logActivity(admin.email, 'UPDATE_CATEGORY', 'CATEGORY', currentCat.id, {
      name,
      slug: currentCat.slug,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/categories');
      revalidatePath(`/categories/${currentCat.slug}`);
      revalidatePath('/products');
    } catch {}

    return NextResponse.json({ success: true, message: 'Category updated successfully.' });
  } catch (error: any) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
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
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Category ID or slug is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT id, slug, name FROM categories WHERE id = ? OR slug = ? LIMIT 1',
      [id || '', slug || '']
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    const cat = rows[0];

    // Delete associated products as well
    await db.query('DELETE FROM products WHERE category_slug = ?', [cat.slug]);
    await db.query('DELETE FROM categories WHERE id = ?', [cat.id]);

    await logActivity(admin.email, 'DELETE_CATEGORY', 'CATEGORY', cat.id, {
      name: cat.name,
      slug: cat.slug,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/categories');
      revalidatePath(`/categories/${cat.slug}`);
      revalidatePath('/products');
    } catch {}

    return NextResponse.json({ success: true, message: 'Category and its products deleted successfully.' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}
