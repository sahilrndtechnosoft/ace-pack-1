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

export const blogPosts: BlogPost[] = rawBlogs as BlogPost[];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const normalized = slug.trim().toLowerCase();
  return blogPosts.find((post) => post.slug.toLowerCase() === normalized);
};

export const getAllBlogSlugs = (): string[] => {
  return blogPosts.map((post) => post.slug);
};

export function combineBlogs(
  staticList: BlogPost[],
  cmsList: BlogPost[] | null | undefined
): BlogPost[] {
  if (!cmsList || cmsList.length === 0) return staticList;
  const cmsMap = new Map<string, BlogPost>();
  for (const b of cmsList) {
    cmsMap.set(b.slug.toLowerCase(), b);
  }

  const combined: BlogPost[] = [];
  for (const s of staticList) {
    const cmsItem = cmsMap.get(s.slug.toLowerCase());
    if (cmsItem) {
      combined.push({
        ...s,
        ...cmsItem,
        content_html: cmsItem.content_html || s.content_html,
        meta_title: cmsItem.meta_title || s.meta_title,
        meta_description: cmsItem.meta_description || s.meta_description,
        canonical: cmsItem.canonical || s.canonical,
        views: cmsItem.views || s.views,
      });
      cmsMap.delete(s.slug.toLowerCase());
    } else {
      combined.push(s);
    }
  }

  for (const remaining of cmsMap.values()) {
    combined.push(remaining);
  }

  return combined;
}
