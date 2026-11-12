import rawBlogs from './acepack-all-blogs.json';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  image_alt?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string[];
  content_html?: string;
  meta_title?: string;
  meta_description?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  views?: string;
  takeaways?: string[];
  tags?: string[];
}

// Crawled copy of www.acepack.co.in/blogs (scripts/crawl_acepack_full.py). Same defaults as
// scripts/sync_blogs_to_mysql.js so the fallback renders like the database version.
export const blogPosts: BlogPost[] = rawBlogs.map((raw) => ({
  ...raw,
  id: `blog_${raw.slug}`,
  category: 'Industry Trends',
  readTime: '5 min read',
  content: [],
}));

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const normalized = slug.trim().toLowerCase();
  return blogPosts.find((post) => post.slug.toLowerCase() === normalized);
};

export const getAllBlogSlugs = (): string[] => {
  return blogPosts.map((post) => post.slug);
};

/**
 * The database is the source of truth (admins add, edit, unpublish and delete there).
 * The crawled JSON copy is only used when the database can't be reached (`null`).
 */
export function combineBlogs(staticList: BlogPost[], cmsList: BlogPost[] | null | undefined): BlogPost[] {
  return cmsList ?? staticList;
}
