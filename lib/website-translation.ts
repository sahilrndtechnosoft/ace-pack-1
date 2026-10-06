import { languages } from './data/languages';

function isPublic(url: URL) {
  const host = url.hostname.toLowerCase();
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password &&
    host.includes('.') && !host.endsWith('.localhost') && !host.endsWith('.local') &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(host) && !host.includes(':');
}

export function translatedWebsiteUrl(page: string, language: string, publishedSite?: string) {
  if (!languages.some(item => item.code === language)) return null;
  try {
    let url = new URL(page);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    // Always translate the source site, never an already-translated proxy.
    // An explicit public origin also allows local previews to open the published version.
    if (!isPublic(url) || url.hostname.endsWith('.translate.goog')) {
      if (!publishedSite) return null;
      const source = new URL(publishedSite);
      if (!isPublic(source) || source.hostname.endsWith('.translate.goog')) return null;
      url = new URL(url.pathname, source.origin);
    }
    url.search = '';
    url.hash = '';
    if (language === 'en') return url.href;
    const translated = new URL('https://translate.google.com/translate');
    translated.search = new URLSearchParams({ sl: 'en', tl: language, u: url.href }).toString();
    return translated.href;
  } catch { return null; }
}
