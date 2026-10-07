import { languages } from './data/languages';

export function languagePreference(cookies: string, saved: string | null) {
  const supported = (code: string | null) => languages.some(item => item.code === code);
  if (supported(saved)) return saved!;
  for (const cookie of cookies.split(';')) {
    const [name,...value] = cookie.trim().split('=');
    if (name !== 'googtrans') continue;
    try {
      const code = decodeURIComponent(value.join('=')).split('/').pop()!;
      if (supported(code)) return code;
    } catch { /* Ignore malformed cookies, not the entire preference restore. */ }
  }
  return 'en';
}

// Google changes text nodes. A translated page must load a fresh document when
// navigating, so React never reconciles a new route against those changed nodes.
export function translationNavigationUrl(href: string, current: string, language: string) {
  if (language === 'en') return null;
  try {
    const page = new URL(current);
    const next = new URL(href,page);
    if (!['http:','https:'].includes(next.protocol) || next.username || next.password ||
        next.origin !== page.origin || (next.pathname === page.pathname && next.search === page.search)) return null;
    return next.href;
  } catch { return null; }
}
