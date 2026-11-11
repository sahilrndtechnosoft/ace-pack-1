// Server-side clean-up for admin-authored article HTML, which the site renders as raw HTML.
// shortcut: regex-based allow-nothing-dangerous filter, not a full HTML parser; switch to a vetted
// sanitizer (e.g. sanitize-html) if non-admin users are ever allowed to submit HTML.

const DANGEROUS = 'script|style|iframe|object|embed|form|input|button|textarea|select|meta|link|base|svg|math|template|noscript';
// Whole element with its contents, then any stray opening/closing/self-closing tag left over.
const DANGEROUS_BLOCKS = new RegExp(`<(${DANGEROUS})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, 'gi');
const DANGEROUS_TAGS = new RegExp(`<\\/?(${DANGEROUS})\\b[^>]*>`, 'gi');
const EVENT_ATTRS = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const SCRIPT_URLS = /\s+(href|src|xlink:href|action|formaction)\s*=\s*("\s*(javascript|vbscript|data):[^"]*"|'\s*(javascript|vbscript|data):[^']*'|(javascript|vbscript|data):[^\s>]*)/gi;
const STYLE_EXPR = /\s+style\s*=\s*("[^"]*(expression|url\s*\()[^"]*"|'[^']*(expression|url\s*\()[^']*')/gi;

export function sanitizeArticleHtml(html: string): string {
  let out = html;
  // Repeat until stable so nested/obfuscated leftovers can't reassemble.
  for (let i = 0; i < 5; i += 1) {
    const next = out
      .replace(DANGEROUS_BLOCKS, '')
      .replace(DANGEROUS_TAGS, '')
      .replace(EVENT_ATTRS, '')
      .replace(SCRIPT_URLS, '')
      .replace(STYLE_EXPR, '');
    if (next === out) break;
    out = next;
  }
  return out.trim();
}

/** Plain-text paragraphs from HTML, kept in the legacy `content` column as a text fallback. */
export function htmlToParagraphs(html: string): string[] {
  return html
    .replace(/<\/(p|h[1-6]|li|div|blockquote)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
