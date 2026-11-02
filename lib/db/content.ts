import { getDbPool, initDb } from './index';
import type { BlogPost } from '../data/blogs';
import type { ExhibitionEvent } from '../data/events';

export async function getCmsPage(slug: string) {
  try {
    await initDb();
    const db = getDbPool();
    const [pageRows]: any = await db.query(
      'SELECT id, slug, title, seo_title, seo_description, og_image, canonical_url, is_published FROM pages WHERE slug = ? LIMIT 1',
      [slug]
    );

    const [sectionRows]: any = await db.query(
      `SELECT section_key, title, subtitle, published_content, sort_order
       FROM sections
       WHERE page_slug = ? AND is_enabled = 1
       ORDER BY sort_order ASC`,
      [slug]
    );

    const sections: Record<string, any> = {};
    for (const sec of sectionRows) {
      try {
        sections[sec.section_key] = {
          title: sec.title,
          subtitle: sec.subtitle,
          ...JSON.parse(sec.published_content),
        };
      } catch {
        sections[sec.section_key] = {
          title: sec.title,
          subtitle: sec.subtitle,
          content: sec.published_content,
        };
      }
    }

    return {
      page: pageRows[0] || null,
      sections,
    };
  } catch (err) {
    console.error(`getCmsPage("${slug}") error:`, err);
    return { page: null, sections: {} };
  }
}

export async function getCmsSettings(): Promise<Record<string, any>> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query('SELECT setting_key, setting_value, setting_type FROM site_settings');
    const settings: Record<string, any> = {};
    for (const r of rows) {
      if (r.setting_type === 'boolean') {
        settings[r.setting_key] = r.setting_value === 'true';
      } else if (r.setting_type === 'json') {
        try {
          settings[r.setting_key] = JSON.parse(r.setting_value);
        } catch {
          settings[r.setting_key] = r.setting_value;
        }
      } else {
        settings[r.setting_key] = r.setting_value;
      }
    }
    return settings;
  } catch (err) {
    console.error('getCmsSettings error:', err);
    return {};
  }
}

function mapRowToBlogPost(r: any): BlogPost {
  let content: string[] = [];
  try {
    const parsed = JSON.parse(r.content);
    content = Array.isArray(parsed) ? parsed : [r.content];
  } catch {
    content = typeof r.content === 'string' ? r.content.split('\n\n').filter(Boolean) : [String(r.content || '')];
  }

  let takeaways: string[] = [];
  try {
    const parsed = JSON.parse(r.takeaways);
    takeaways = Array.isArray(parsed) ? parsed : [];
  } catch {
    takeaways = [];
  }

  let tags: string[] = [];
  try {
    const parsed = JSON.parse(r.tags);
    tags = Array.isArray(parsed) ? parsed : [];
  } catch {
    tags = [];
  }

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category || 'Industry Trends',
    summary: r.summary || '',
    content,
    takeaways,
    tags,
    image: r.image || '/images/hero-bg-image.jpg',
    author: {
      name: r.author_name || 'Ace Editorial Team',
      role: r.author_role || 'Packaging Technology Specialist',
      avatar: r.author_avatar || '/images/hero-bg-image.jpg',
    },
    readTime: r.read_time || '5 min read',
    date: r.date || 'October 2026',
  };
}

export async function getCmsBlogs(): Promise<BlogPost[]> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM blogs WHERE is_published = 1 ORDER BY date DESC, created_at DESC'
    );
    return rows.map(mapRowToBlogPost);
  } catch (err) {
    console.error('getCmsBlogs error:', err);
    return [];
  }
}

export async function getCmsBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM blogs WHERE slug = ? AND is_published = 1 LIMIT 1',
      [slug]
    );
    if (!rows.length) return null;
    return mapRowToBlogPost(rows[0]);
  } catch (err) {
    console.error(`getCmsBlogBySlug("${slug}") error:`, err);
    return null;
  }
}

function mapRowToExhibitionEvent(r: any): ExhibitionEvent {
  let fullStory: string[] = [];
  if (r.full_desc) {
    try {
      const parsed = JSON.parse(r.full_desc);
      fullStory = Array.isArray(parsed) ? parsed : [r.full_desc];
    } catch {
      fullStory = typeof r.full_desc === 'string' ? r.full_desc.split('\n\n').filter(Boolean) : [];
    }
  }

  let gallery: string[] = [];
  if (r.gallery) {
    try {
      const parsed = JSON.parse(r.gallery);
      gallery = Array.isArray(parsed) ? parsed : [];
    } catch {
      gallery = [];
    }
  }

  const locationParts = (r.location || 'Daman, India').split(',');
  const venue = locationParts[0]?.trim() || r.location;
  const city = locationParts[1]?.trim() || 'Daman';

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    shortTitle: r.title.length > 24 ? r.title.slice(0, 24) + '...' : r.title,
    label: (r.category || 'EXHIBITION').toUpperCase(),
    category: (['expo', 'summit', 'experience', 'showcase'].includes(r.category)
      ? r.category
      : 'expo') as any,
    status: r.is_featured ? 'featured' : 'upcoming',
    date: r.date || '2026',
    year: r.date?.match(/\d{4}/)?.[0] || '2026',
    location: r.location || 'India',
    venue,
    city,
    country: 'India',
    booth: r.booth || undefined,
    image: r.image || '/images/hero-bg-image.jpg',
    description: r.short_desc || '',
    fullStory: fullStory.length > 0 ? fullStory : undefined,
    highlights: [
      'Live demonstration of high-speed precision injection moulding',
      'Food-grade virgin PP 05 and IML container samples on display',
      'Direct interaction with Ace Packaging technical and mould tooling engineers',
    ],
    focusProducts: [
      { name: 'IML Custom Branded Containers', slug: 'custom-iml', desc: 'Photorealistic in-mould labelling fused directly into polymer.' },
      { name: 'RE Series Bento Compartments', slug: 're-series', desc: 'Perimeter snap seal preventing curry migration between sections.' },
    ],
  };
}

export async function getCmsEvents(): Promise<ExhibitionEvent[]> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM events WHERE is_published = 1 ORDER BY is_featured DESC, created_at DESC'
    );
    return rows.map(mapRowToExhibitionEvent);
  } catch (err) {
    console.error('getCmsEvents error:', err);
    return [];
  }
}

export async function getCmsEventBySlug(slug: string): Promise<ExhibitionEvent | null> {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM events WHERE slug = ? AND is_published = 1 LIMIT 1',
      [slug]
    );
    if (!rows.length) return null;
    return mapRowToExhibitionEvent(rows[0]);
  } catch (err) {
    console.error(`getCmsEventBySlug("${slug}") error:`, err);
    return null;
  }
}

export async function getCmsDownloads() {
  try {
    await initDb();
    const db = getDbPool();
    const [rows]: any = await db.query(
      'SELECT * FROM downloads WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
    );
    return rows;
  } catch (err) {
    console.error('getCmsDownloads error:', err);
    return [];
  }
}
