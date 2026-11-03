import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { getDbPool, initDb, logActivity } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const db = getDbPool();
    let query = 'SELECT * FROM blogs WHERE 1=1 ';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ? ';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR slug LIKE ?) ';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC ';

    const [blogs]: any = await db.query(query, params);

    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    console.error('Get blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs.' }, { status: 500 });
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
      title,
      slug,
      category,
      summary,
      content,
      takeaways,
      tags,
      image,
      author_name,
      author_role,
      author_avatar,
      read_time,
      is_published,
    } = body;

    if (!title || !summary) {
      return NextResponse.json({ error: 'Blog title and summary are required.' }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const id = 'blog_' + cleanSlug;
    const contentStr = Array.isArray(content) ? JSON.stringify(content) : JSON.stringify([String(content || '')]);
    const takeawaysStr = Array.isArray(takeaways) ? JSON.stringify(takeaways) : '[]';
    const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : '[]';
    const postDate = new Date().toISOString().split('T')[0];

    const db = getDbPool();
    await db.query(
      `INSERT INTO blogs (id, slug, title, category, summary, content, takeaways, tags, image, author_name, author_role, author_avatar, read_time, date, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        cleanSlug,
        title.trim(),
        category || 'Industry Insight',
        summary.trim(),
        contentStr,
        takeawaysStr,
        tagsStr,
        image || '/images/hero-bg-image.jpg',
        author_name || admin.name,
        author_role || 'Packaging Specialist',
        author_avatar || '/images/Ace_New_Update_Logo-01.png',
        read_time || '4 min read',
        postDate,
        is_published !== undefined ? (is_published ? 1 : 0) : 1,
      ]
    );

    await logActivity(admin.email, 'CREATE_BLOG', 'BLOG', id, { title, slug: cleanSlug });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${cleanSlug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Blog post created successfully.', blogId: id });
  } catch (error: any) {
    console.error('Create blog error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A blog post with this URL slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create blog post.' }, { status: 500 });
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
      title,
      slug,
      category,
      summary,
      content,
      takeaways,
      tags,
      image,
      author_name,
      author_role,
      author_avatar,
      read_time,
      is_published,
    } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Blog ID and title are required.' }, { status: 400 });
    }

    const contentStr = content !== undefined
      ? (Array.isArray(content) ? JSON.stringify(content) : (typeof content === 'string' ? content : JSON.stringify([content])))
      : null;
    const takeawaysStr = takeaways !== undefined ? JSON.stringify(takeaways) : null;
    const tagsStr = tags !== undefined ? JSON.stringify(tags) : null;

    const db = getDbPool();
    await db.query(
      `UPDATE blogs
       SET title = ?,
           slug = COALESCE(?, slug),
           category = COALESCE(?, category),
           summary = COALESCE(?, summary),
           content = COALESCE(?, content),
           takeaways = COALESCE(?, takeaways),
           tags = COALESCE(?, tags),
           image = COALESCE(?, image),
           author_name = COALESCE(?, author_name),
           author_role = COALESCE(?, author_role),
           author_avatar = COALESCE(?, author_avatar),
           read_time = COALESCE(?, read_time),
           is_published = COALESCE(?, is_published),
           updated_at = NOW()
       WHERE id = ?`,
      [
        title.trim(),
        slug ? slug.toLowerCase().trim() : null,
        category || null,
        summary || null,
        contentStr,
        takeawaysStr,
        tagsStr,
        image || null,
        author_name || null,
        author_role || null,
        author_avatar || null,
        read_time || null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    await logActivity(admin.email, 'UPDATE_BLOG', 'BLOG', id, { title, slug });

    try {
      revalidatePath('/blog');
      if (slug) revalidatePath(`/blog/${slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Blog post updated successfully.' });
  } catch (error: any) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog post.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Blog ID is required.' }, { status: 400 });
    }

    const db = getDbPool();
    const [rows]: any = await db.query('SELECT title, slug FROM blogs WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
    }

    const blog = rows[0];
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);

    await logActivity(admin.email, 'DELETE_BLOG', 'BLOG', id, { title: blog.title, slug: blog.slug });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${blog.slug}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post.' }, { status: 500 });
  }
}
