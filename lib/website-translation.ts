import { languages } from './data/languages';

export function translatedWebsiteUrl(page: string, language: string) {
  if (!languages.some(item => item.code === language)) return null;
  try {
    const url = new URL(page);
    const host = url.hostname.toLowerCase();
    // Google cannot fetch private/local previews. Never send their URLs to it.
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        !host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') ||
        /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':')) return null;
    url.search = '';
    url.hash = '';
    const translated = new URL('https://translate.google.com/translate');
    translated.search = new URLSearchParams({ sl: 'en', tl: language, u: url.href }).toString();
    return translated.href;
  } catch { return null; }
}
