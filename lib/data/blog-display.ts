/** Category every imported post got, because the live blog has none. */
export const IMPORTED_BLOG_CATEGORY = 'Industry Trends';

// First match wins, so narrower topics come before the broad ones.
const TOPIC_RULES: { category: string; pattern: RegExp }[] = [
  { category: 'Sustainability', pattern: /eco|sustainab|recycl|reus|environment|greener|waste/ },
  { category: 'Food Safety & Freshness', pattern: /safety|safe|hygien|food grade|shelf life|leak|fresh|standards|freez|reheat|microwave/ },
  { category: 'Manufacturing & Quality', pattern: /manufactur|made\b|quality|injection|wholesale|industrial/ },
  { category: 'Trends & Innovation', pattern: /trend|future|innovation|newest|what.s new|revolution/ },
  { category: 'Restaurants & Delivery', pattern: /takeaway|delivery|restaurant|cloud kitchen|qsr|cafe|catering|fast-food|retail|business|operation|workflow|brand|customer|kitchens? and/ },
  { category: 'Buying Guides', pattern: /choos|guide|select|\bvs\.?\b|which|how to|best|types|benefit|advantage|why/ },
];
const FALLBACK_CATEGORY = 'Product Spotlights';

/**
 * Posts still on the import default get a topic from their title so the blog filter is useful.
 * A category set in the CMS always wins.
 */
export function blogCategory(category: string | null | undefined, title: string): string {
  const set = category?.trim();
  if (set && set !== IMPORTED_BLOG_CATEGORY) return set;
  const text = title.toLowerCase();
  return TOPIC_RULES.find((rule) => rule.pattern.test(text))?.category ?? FALLBACK_CATEGORY;
}

const BRAND_MARK = '/images/ace-mark.png';
// The wide wordmark files that imported posts use as the author photo; unreadable in a small circle.
const WORDMARK_AVATARS = new Set(['/Ace_New_Update_Logo-01.png', '/ACE_Pack_Logo-01.png', '/images/Ace_New_Update_Logo-01.png', '/images/ACE_Pack_Logo-01.png', '/images/ace-logo.png', '/images/hero-bg-image.jpg']);

/** Author photo for a post: the square brand mark unless the CMS has a real person's photo. */
export function blogAuthorAvatar(avatar: string | null | undefined): string {
  const value = avatar?.trim();
  return value && !WORDMARK_AVATARS.has(value) ? value : BRAND_MARK;
}

/** Read count from the stored label ("1101 Views", "1,101"); 0 when there is none. */
export function blogViewCount(views: string | null | undefined): number {
  const digits = views?.replace(/,/g, '').match(/\d+/)?.[0];
  return digits ? Number(digits) : 0;
}

/** "1,101 views" with Indian digit grouping, or null when the post has no reads yet. */
export function formatBlogViews(views: string | null | undefined): string | null {
  const count = blogViewCount(views);
  if (count === 0) return null;
  return `${count.toLocaleString('en-IN')} ${count === 1 ? 'view' : 'views'}`;
}
