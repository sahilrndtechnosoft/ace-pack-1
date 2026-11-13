'use client';

import { useEffect } from 'react';

/** Records one read of the post when it opens (the server ignores repeats from the same browser). */
export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blogs/${encodeURIComponent(slug)}/view`, { method: 'POST', keepalive: true }).catch((err: unknown) => {
      console.warn('Blog view not recorded:', err);
    });
  }, [slug]);
  return null;
}
